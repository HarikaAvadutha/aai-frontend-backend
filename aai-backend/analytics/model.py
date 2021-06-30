import os
import math
import copy

import pandas as pd
import numpy as np

import matplotlib.pyplot as plt

import torch
import torch.nn as nn
import torchvision
import torch.nn.functional as F

# import skimage
from skimage.io import imread

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder

#from .utils import ImageDataset



class multi_task_resnet(torch.nn.Module):
    def __init__(self, model_core, dd, artist_num, object_num, material_num, prediction_year):
        super(multi_task_resnet, self).__init__()

        # model_core: pretrained ResNet
        # dd: dropout

        self.resnet_model = model_core

        ## generate the input
        self.x1 =  nn.Linear(512,256) 
        nn.init.xavier_normal_(self.x1.weight)      
        self.bn1 = nn.BatchNorm1d(256,eps = 2e-1)
        self.x2 =  nn.Linear(256,256) # task 2
        nn.init.xavier_normal_(self.x2.weight)
        self.bn2 = nn.BatchNorm1d(256,eps = 2e-1)  

        
        
        self.y1o = nn.Linear(256, artist_num)
        nn.init.xavier_normal_(self.y1o.weight)
        
        self.y2o = nn.Linear(256,object_num)
        nn.init.xavier_normal_(self.y2o.weight)
        
        self.y3o = nn.Linear(256,material_num)
        nn.init.xavier_normal_(self.y3o.weight)
        
        self.y4o = nn.Linear(256, prediction_year)
        nn.init.xavier_normal_(self.y4o.weight)

        '''
        self.y5o = nn.Linear(256,color_nodes)
        nn.init.xavier_normal_(self.y5o.weight)
        '''
        
        self.d_out = nn.Dropout(dd)

    def forward(self, x):
        print("IN FORWARD")
        x1 = self.resnet_model(x)
        #x1 =  F.relu(self.x1(x1))
        #x1 =  F.relu(self.x2(x1))
        
        x1 =  self.d_out(self.bn1(F.relu(self.x1(x1))))
        #x1 =  self.d_out(self.bn2(F.relu(self.x2(x1))))
        #x = F.relu(self.x2(x))
        #x1 = F.relu(self.x3(x))
        
        # tasks
        y1o = self.y1o(x1) #torch.sigmoid(self.y1o(x1)) # artist multi-class classification

        y2o = self.y2o(x1) # object, multi-label classification

        y3o = self.y3o(x1)
        
        y4o = self.y4o(x1)

        '''
        y5o = torch.sigmoid(self.y5o(x1)) #should be sigmoid
        '''
        
        return y1o, y2o, y3o, y4o #, y5o




