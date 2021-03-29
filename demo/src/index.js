//import React, {Component} from 'react'
import React from 'react';
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import VideoLooper from '../../src'
import { Editor } from './editor.js'
import useFormData from 'react-use-form-data'

export default function Demo() {

    const [formData, updateFormData, initialFormData, isInitialDataForPlaceholder] = useFormData({
        sampleVideo: 'http://192.168.240.174:5500/demo/assets/paralettes.mp4',
        start: 0.17,
        end: 0.48,
        isEditorActive: false,
        isDebugMode: true,
        isSplitView: false
    }, true);

    return (
        <div>
            <GlobalStyle></GlobalStyle>
            <Editor {...formData} updateFormData={updateFormData} initialFormData={isInitialDataForPlaceholder && initialFormData}></Editor>
            <VideoLooper source={formData.sampleVideo} start={Number(formData.start)} end={Number(formData.end)} isDebugMode={formData.isDebugMode} isSplitView={formData.isSplitView} />
        </div>
    )

}

const GlobalStyle = createGlobalStyle`
  body {
    background: black;
    margin: 0
  }
`
render(<Demo />, document.querySelector('#demo'))