module.exports = {
    ssh: {
        host: 'fms.edu.yar.ru',
        port: 22,
        username: 'programmist'
    },
    source: {
        styles: 'source/less/*.less',
        less: ['source/less/styles.css', 'source/less/check.css'],
        ts: ['source/typescript/**/*.{ts,tsx}', 'node_modules/@types/{react,react-dom,requirejs}/*.d.ts'], //модули ctiso
        nodejs: ['source/nodeserver/**/*.{ts,tsx}',
            'source/typescript/model/shared/*.{ts,tsx}',
            'source/typescript/typings/*.{ts,tsx}'
            /*,
                             'node_modules/@types/node/*.d.ts'*/
        ]
    },
    output: {
        server_css: 'server/public/css',
        css: 'public/css',
        swf: 'public/swf',
        js: 'public/script/js/',
        ejs: 'server/views',
        nodejs: 'server'
    }
};