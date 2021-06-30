import React from 'react';

function field(props) {
  const fieldConfig = props.fieldConfig;
  let element = null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let [activeIndex, setActiveIndex] = React.useState(0);
  let [unitChanged, setUnitChanged] = React.useState(true);

  const onSelectValueChange = (value, index) => {
    setActiveIndex(index);
    props.changed({ target: { value: value } }, fieldConfig);
  }

  const onCustomValueChange = (e, item) => {
    props.customOnChange(e.target.value, fieldConfig, item);
  }

  const onDimensionUnitChange = () => {
    setUnitChanged(!unitChanged);
    props.dimensionUnitChange(fieldConfig);
  }

  // eslint-disable-next-line default-case
  switch (fieldConfig.type) {
    case 'input':
      element = (<input type={fieldConfig.dataType}
        className='input-type'
        name={fieldConfig.id}
        placeholder={fieldConfig.placeholder}
        required={fieldConfig.validation.required}
        onChange={props.changed}
      />);
      break;
    case 'select':
      element = (
        <div>
          {fieldConfig.options.map(option => (
            <div
              className={`select-type ${option.index === activeIndex ? 'active' : ''}`}
              key={option.value}
              onClick={() => onSelectValueChange(option.value, option.index)}>
              <span className="label">{option.displayValue}</span>
            </div>
          ))}
        </div>
      );
      break;
    case 'custom':
      element = (
        <div>
          <span> Measure to 1/4 inch.</span>
          {fieldConfig.config.map(item => (
            <div className="custom-div" key={item.id}>
              <div className="header">{item.id}</div>
              <span className="arrows">
                {item.id !== 'Height' ?
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
                  </svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
                  </svg>}
              </span>
              <input className="number-type" type="number" onChange={(e) => onCustomValueChange(e, item)} />
              <span>{unitChanged ? item.type : 'cm'}</span>
            </div>
          ))}
          <div style={{padding: '5px', textAlign:'right'}}>
              cm
              <label class='switch'>
                <input type='checkbox' onClick={() => onDimensionUnitChange()}/>
                <span class="slider round"></span>
              </label>
              inches
          </div>
        </div>
      );
      break;
  };

  return (
    <div>
      <div className="field-wrapper field-container">
        <span className='header'>{fieldConfig.id}:</span>&nbsp;&nbsp;
        <span className='required'>{fieldConfig.validation.required ? 'Required' : 'Optional'}</span>
        <div>{element}</div>
      </div>

      <button className='next-button'
        onClick={() => props.onNextClick()}>NEXT</button>
    </div>
  )
}

export default field;