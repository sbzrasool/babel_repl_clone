import React, { useState, useEffect, useRef } from 'react';

import _ from 'lodash';
import * as babel from '@babel/standalone';

import Input from './components/Input';
import Output from './components/Output';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const ref = useRef();

  // start --------- Debounce logic for typed input 
  useEffect(() => {
    ref.current = _.debounce(generateResult, 1000);
  }, []);
  // end -----------

  // start --------- Save the input code 
  useEffect(() => {
    try{
      setInput(JSON.parse(localStorage.getItem('babel_code')));
    } catch(e){
      setInput('');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('babel_code', JSON.stringify(input));
  }, [input]);
  // end ----------


  function generateResult(value){
    try{
      const result = babel.transform(value, {
        presets : ['env', 'react'],
        filename : '/App.js'
      }).code;

      setOutput(result);
      setErrorMsg('');
    } catch (e) {
      setErrorMsg(e.message);
    }
  }

  function handleInputChange(event){
      const value = event.target.value;

      setInput(value);
      
      ref.current(value)
  }
  
  return (
    <div>
      <h1>Babel Transpiler</h1>
      <Input 
        input = {input ? input : ''}
        handleInputChange = {handleInputChange}
        errorMsg = {errorMsg}
      />
      <Output 
        output = {output}
        hasError = {!_.isEmpty(errorMsg)}
      />
    </div>
  );
};

export default App;