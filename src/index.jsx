import * as $ from 'jquery'
import Post from 'models/Post'
// import json from './assets/json'
// import xml from './assets/data.xml'
// import csv from './assets/data.csv'
import WebpackLogo from './assets/webpack-logo.png'
import React from 'react'
import { render } from 'react-dom'
import './babel'
import './styles/styles.css'
import './styles/less.less'
import './styles/scss.scss'

const post = new Post('Webpack Post Titile', WebpackLogo)

console.log('Post: ', post.toString())
$('pre').addClass('code').html(post.toString())


const App = () => (
  <div className="container">
    <h1>Webpack course</h1>
    <hr />
    <div className="logo"></div>
    <hr />
    <pre />
    <hr />
    <div className="box">
      <h2>Less</h2>
    </div>
    <hr />
    <div className="card">
      <h2>SCSS</h2>
    </div>
  </div>
)

render(<App />, document.getElementById('app'))
// console.log('json: ', json)
// console.log('xml: ', xml)
// console.log('csv: ', csv)

/////1:54 min