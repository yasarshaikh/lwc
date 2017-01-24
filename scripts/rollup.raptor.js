/*jshint node: true */

/**
 * This file builds the framework and services.
 */

'use strict'

const argv = require('yargs').argv;
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const strip = require('rollup-plugin-strip');
const flow = require('rollup-plugin-flow');
const nodeResolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');

const fwPlugins = [
    flow({
        all: true,
        exclude: '**/node_modules/**',
    }),
    babel({
        babelrc: false,
        presets: [
            [
                "es2015",
                {
                    "modules": false
                }
            ]
        ],
    }),
    nodeResolve({
        module: true,
    }),
    commonjs({
        sourceMap: false,
    }),
];

if (argv.production) {
    fwPlugins.push(
        strip({
            debugger: true,
            functions: [ 'console.*', 'assert.*' ],
        })
    );
    // fwPlugins.push(
    //     uglify({
    //         warnings: false
    //     })
    // );
}

function buildBundle(bundleConfig) {
    return rollup.rollup(bundleConfig.input)
        .then(function(bundle) {
            return bundle.write(bundleConfig.output);
        }).then(() => bundleConfig.output.dest);
}

function buildBundles(configs) {
    const promises = configs.map(buildBundle);
    return Promise.all(promises)
        .then((bundles) => {
            console.log('-> built %d bundles', configs.length)
            return bundles;
        });
}

// framework configuration
const configs = [{
    folder: 'src/framework',
    input: {
        entry: 'src/framework/main.js',
        plugins: fwPlugins,
    },
    output: {
        dest: 'fake-cdn/raptor.js',
        format: 'iife',
        moduleName: 'Raptor',
        sourceMap: true,
    }
}];

if (argv.watch) {
    console.log('watching...');

    const watch = require('watch');
    const EventEmitter = require('events');
    const watcher = new EventEmitter();

    configs.forEach((bundleConfig) => {
        watch.watchTree(bundleConfig.folder, function onFileChange() {
            buildBundle(bundleConfig)
                .then((dest) => {
                    console.log('-> built [%s] bundle', dest);
                    watcher.emit('rolled');
                })
                .catch((err) => {
                    console.error(err.stack)
                });
        })
    });
} else {
    console.log('building...');

    buildBundles(configs).catch((err) => {
        console.error(err.stack)
    });
}