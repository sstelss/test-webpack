const { pathToFileURL } = require("url");

const path = require('path')
const HtmlWebpackPlagin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWecpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const filename = ext => {
  return isDev ? `[name].${ext}` : `[name].[hash].${ext}`
}

const cssLoaders = extra => {
  const loaders = [{
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: isDev,
      reloadAll: true
    },
  }, 'css-loader']

  extra && loaders.push(extra)

  return loaders
}

const babelOptions = (preset) => {
  const opts = {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }
  }

  if (preset) {
    opts.options.presets.push(preset)
  }
  
  return opts
}

const jsLoader = () => {
  const loaders = [{
    loader: 'babel-loader',
    options:  {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }
  }]

  isDev && loaders.push('eslint-loader')

  return loaders
}

const plugins = () => {
  const base = [
    // плагин позволяет задать шаблон html файла к которому в последующем подключатся собраные бандлы
    new HtmlWebpackPlagin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    // плагин для очистки dist перед каждым пересобиранием
    new CleanWebpackPlugin(),
    // плагин позволяющий копировать указанные файлы в указанные места
    new CopyWecpackPlugin({
      patterns: [
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
      path: path.resolve(__dirname, 'dist')
    })
  ]

  isProd && base.push(new BundleAnalyzerPlugin())

  return base
}

module.exports = {
  // задает дефолтный контекст, здесь мы выбрали src и теперь в аутпуте он по умолчание считает что находится в src
  context: path.resolve(__dirname, 'src'),
  // режим сборки
  mode: 'development',
  // точки входа, сейчас создастся два бандла main и analytics которые в свою очередь подключатся к html файлу при помощи плагина
  entry: {
    main: [ '@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts'
  },
  // параметры выходного файла
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    // дефолтные расширения, то есть можно указать только имя файла без расширения
    extensions: ['.js', '.json', '.png'],
    // задем маршруты по имени, то есть теперь @models будет заменен на __dirname/src/models
    alias: {
      'models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  // можем смотреть код не мемоизированный и не преобразованный
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    // лоадеры применяются справа налево
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoader()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: babelOptions('@babel/preset-typescript')
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: babelOptions('@babel/preset-react')
      },
      {
        test: /\.css$/,
        // style-loader добавляет стили в хедер html документа
        // use: ['style-loader', 'css-loader']
        use: cssLoaders()
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
       }
    ]
  }
}