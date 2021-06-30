from django.db import models
#from projects.models import Project

import os.path
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
from aai_backend.settings import BASE_DIR
from aai_backend.settings import BEST_MODEL
from aai_backend.settings import DATA_PARAMS_75, DICT_ARTIST_75, DICT_MATERIAL_75, DICT_OBJECT_75, YEAR_SCALING

import torch
torch.cuda.empty_cache()
import torch.nn as nn
import torch.nn.functional as F
import torchvision
import numpy as np
import time
import json
import pandas as pd
import glob
import getopt, sys
import json

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder
from skimage.io import imread
import skimage

from .model import multi_task_resnet


class File(models.Model):
    file=models.FileField(blank=False,null=False)
    remark=models.CharField(max_length=20)
    timestamp=models.DateTimeField(auto_now_add=True)
    analytics=models.JSONField(editable=False, default=dict) 
    
    def save(self, *args, **kwargs):
        #image=Image.open(self.file)
        #image.save('F:\\test.jpg', 'JPEG')
        self.analytics=self.run_model()
        super(File, self).save(*args, **kwargs)

    def run_model(self):
        algostart = time.time()
        print("RAW IMAGE IS: " + str(self.file) + " AND TYPE IS: " + str(type(self.file)))

        #Inference-Art-Attributes

        if torch.cuda.is_available():
            USE_GPU = True
            print("GPU enabled")
        else:
            USE_GPU = False
            print("CPU only")

        #artist_num, object_num, material_num, year_num = np.genfromtxt("data_train_params_th_" + str(threshold) + ".csv", delimiter=',').astype(int)
        artist_num=DATA_PARAMS_75[0]
        object_num=DATA_PARAMS_75[1]
        material_num=DATA_PARAMS_75[2]
        year_num=DATA_PARAMS_75[3]

        transform_pipe = torchvision.transforms.Compose([
            torchvision.transforms.ToPILImage(), # Convert np array to PILImage
            
            # Resize image to 224 x 224 as required by most vision models
            torchvision.transforms.Resize(
                size=(224, 224)
            ),
            
            # Convert PIL image to tensor with image values in [0, 1]
            torchvision.transforms.ToTensor(),
            
            torchvision.transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        #Transform the image to the correct format
        img = skimage.color.gray2rgb(imread(self.file))
        transformed_image=transform_pipe(img)

        model_ft = torchvision.models.resnet50(pretrained=True)
        num_ftrs = model_ft.fc.in_features
        print("NUM FEATURES="+str(num_ftrs))
        model_ft.fc = nn.Linear(num_ftrs, 512)

        dd = 0.1

        model = multi_task_resnet(model_ft, dd, artist_num, object_num, material_num, year_num)

        if USE_GPU:
            model.load_state_dict(BEST_MODEL)
            model.eval()
            model = model.cuda() # Should be called before instantiating optimizer according to docs: https://pytorch.org/docs/stable/nn.html
        else:
            model.load_state_dict(BEST_MODEL)
            model.eval()

        X=transformed_image.unsqueeze(0)

        if USE_GPU:
            X = X.cuda()

        with torch.no_grad():
            y_artist, y_object, y_material, y_year = model(X)
            y_object = torch.sigmoid(y_object)  # torch.Size([N, C]) e.g. tensor([[0., 0.5, 0.]])
            y_material = torch.sigmoid(y_material)  # torch.Size([N, C]) e.g. tensor([[0., 0.5, 0.]])

        #Store predicted values
        pred_artist_val=(y_artist.float()).cpu().detach().numpy()
        pred_object_val=(y_object.float()).cpu().detach().numpy()
        pred_material_val=(y_material.float()).cpu().detach().numpy()
        pred_year_val=(y_year.float()).cpu().detach().numpy()


        #Post processing for summary
        a = YEAR_SCALING
        yscale = a[0] # 2020
        yoff = a[1]

        artist_num=DATA_PARAMS_75[0]
        object_num=DATA_PARAMS_75[1]
        material_num=DATA_PARAMS_75[2]
        year_num=DATA_PARAMS_75[3]

        topK=5

        topK = min(topK, artist_num - 2)

        dict_object = DICT_OBJECT_75
        dict_artist = DICT_ARTIST_75
        dict_material = DICT_MATERIAL_75

        th_material = 0.5
        th_object = 0.5

        #topK artist names
        #print("ARTIST SORT")
        artist_sort=np.argsort(pred_artist_val)
        
        artist_prob=np.exp(pred_artist_val)
        sum0 = np.sum(artist_prob)
        artist_prob = np.divide(artist_prob, sum0)

        #Squeeze dimensions as we only have 1 sample. If have more than 1 sample then need outer for loop for first dimension
        artist_sort=np.squeeze(artist_sort)
        #print(artist_sort.shape)
        artist_prob=np.squeeze(artist_prob)
        #print(artist_prob.shape)
        pred_object_val=np.squeeze(pred_object_val)
        #print(pred_object_val.shape)
        pred_material_val=np.squeeze(pred_material_val)
        #print(pred_material_val.shape)
        pred_year_val=np.squeeze(pred_year_val)

        #Add the top k artists to a list in tuples of form (artist_name, probability)
        topkartists=[]
        for j in range(topK):
            jj = artist_sort[artist_num - 1 - j]
            topkartists.append((dict_artist.iloc[jj, 1], artist_prob[jj]))

        #Add object types in a simple list. If there are no object types that pass the threshold, add unknown
        objects=[]
        #print("OBJECT")
        for j in range(object_num):
            #print(pred_object_val[j])
            #CHANGED FROM j+1 to j is this correct?
            if pred_object_val[j] > th_object:
                objects.append((dict_object.iloc[j,0][7:],pred_object_val[j]))

        if len(objects)==0:
            objects.append(('unknown',0))
        
        materials=[]
        #print("MATERIAL")
        for j in range(material_num):
            #print(pred_material_val[j])
            if pred_material_val[j] > th_material:
                materials.append((dict_material.iloc[j, 0][10:],pred_material_val[j]))

        if len(materials)==0:
            materials.append(('unknown',0))

        print(topkartists)
        print(objects)
        print (materials)
        print(int(np.round((pred_year_val * yscale) + yoff)))

        #Processing into json
        results={}
        results['Artist']={}
        results['Artist']['TopResult']={}
        results['Artist']['TopResult']['confidence']=float(topkartists[0][1])
        results['Artist']['TopResult']['value']=topkartists[0][0]
        results['Artist']['OtherResults']=[]
        for artistnum in range(1,len(topkartists)):
            results['Artist']['OtherResults'].append({'confidence':float(topkartists[artistnum][1]),'value':topkartists[artistnum][0]})

        results['Objects']=[]
        for objectnum in range(0,len(objects)):
            results['Objects'].append({'confidence':float(objects[objectnum][1]), 'value':objects[objectnum][0]})
        
        results['Materials']=[]
        for materialnum in range(0,len(materials)):
            results['Materials'].append({'confidence':float(materials[materialnum][1]),'value':materials[materialnum][0]})
        results['Year']=int(np.round((pred_year_val * yscale) + yoff))


        #filename=''.join((str(self.file)).split(".")[:-1])
        #with open("..../data/results/"+filename+"_result.json","w") as outfile:
        #with open(filename+"_result.json","w") as outfile:
            #outfile.write(json.dumps(results,indent=2))

        #file00=open("...\\data\\results\\"+filename+"_result.json","w")
        #file00.write("{\n\"Artist\"{\n\"TopResult\":{\n\"confidence\":"+str(topkartists[0][1]))
        #file00.write(",\n\"value\":\""+str(topkartists[0][0])+"\"\n},\n\"OtherResults\":[\n")

        end = time.time()
        print("Processing Time: ", end - algostart) 
        return json.dumps(results,indent=2)
