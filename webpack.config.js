module.exports = {
    entry: './src/index.ts',
    output: './dist/',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
}