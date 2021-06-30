import Styled from 'styled-components';

const OnStart = Styled.div`
    .on-start {
        text-align: center;
        min-height: 500px;
        max-width: 300px;
        margin: auto;
    }
    .status-bar-div {
        min-height: 120px;
        .status-bar  {
            width: 20%;
            height: 40px;
            border: 1px solid white;
            border-radius: 5px; 
        }
    }
    .next-button {
        float: right;
        padding: 5px;
        border-radius: 20px;
        background-color: #BAA06A;
        width: 90px;
        font-size: 18px;
        font-weight: 600;
        color: black;
        margin: 20px 0;
    }
    .field-container {
        text-align: left;
        min-height:200px;
        .header {
            color: white;
            font-size: 24px;
            font-weight: 700;
            padding-left: 5px;
        }
        .required {
            font-size:20px;
        }
    }
    .input-type {
        border-radius: 20px;
        background-color: #BAA06A;
        padding:5px;
        font-size:16px;
        font-weight:600;
        color: black;
    }
    .select-type {
        border-radius: 20px;
        border: 1px solid #BAA06A;
        color: #BAA06A;
        padding: 5px;
        margin: 3px;
        .label {
            color: #BAA06A;
            padding: 20px;
            font-weight:600;
            font-size: 20px;
        }
    }
    .active {
        background-color: #BAA06A !important;
        color: black !important;
        .label {
            color: black;
        }
    }
    .custom-div {
        padding: 5px;
        .header {
            font-size: 20px;
            font-weight: 600;
            min-width: 100px;
            display:inline-block;
        }
        .number-type {
            width: 70px;
            font-size: 18px;
            background-color: #BAA06A;
            color: black;
            text-align: center;
            border-raidus: 20px;
            margin: 0 10px;
        }
        .arrows {
            margin: 20px;
            min-width: 20px;
        }
    }
    .switch {
		position: relative;
		display: inline-block;
		width: 40px;
		height: 20px;
		margin: 5px;
    }

    .switch input {
		opacity: 0;
		width: 0;
		height: 0;
    }

    .slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #BAA06A;
		-webkit-transition: .4s;
		transition: .4s;
    }

    .slider:before {
		position: absolute;
		content: "";
		height: 13px;
		width: 13px;
		right: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
    }

    input:checked + .slider {
      	background-color: #BAA06A;
    }

    input:focus + .slider {
      	box-shadow: 0 0 1px #BAA06A;
    }

    input:checked + .slider:before {
		-webkit-transform: translateX(-20px);
		-ms-transform: translateX(-20px);
		transform: translateX(-20px);
    }

    .slider.round {
      	border-radius: 34px;
    }

    .slider.round:before {
     	border-radius: 50%;
    }
`;


export { OnStart };
