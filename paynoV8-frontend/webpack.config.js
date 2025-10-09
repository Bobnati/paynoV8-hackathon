module.exports = {
    // ... other webpack configurations
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
                exclude: /stylis-plugin-rtl/, // Ignore source map warnings from this package
            },
        ],
    },
    ignoreWarnings: [/Failed to parse source map/],
};
