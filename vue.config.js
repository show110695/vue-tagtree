module.exports = {
    configureWebpack: {
        output: {
            libraryExport: 'default'
        }
    },
    publicPath: './', // 基本路径
    outputDir: 'dist', // 输出文件目录
    productionSourceMap: false
}