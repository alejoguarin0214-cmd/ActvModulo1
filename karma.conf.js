// Configuración de Karma para las pruebas unitarias (generada con "ns test init" + karma-junit-reporter)
module.exports = function (config) {
  const options = {
    // carpeta base de los archivos de la app
    basePath: 'src',

    // framework de pruebas
    frameworks: ['jasmine'],

    exclude: [],
    preprocessors: {},

    // Módulo 4: además del reporte por consola ('progress') se genera un XML con 'junit'
    reporters: ['progress', 'junit'],

    // karma-junit-reporter: el XML queda en la carpeta TESTS-NativeScript en la raíz del proyecto
    junitReporter: {
      outputDir: process.env.JUNIT_REPORT_PATH || require('path').join(__dirname, 'TESTS-NativeScript'),
      outputFile: process.env.JUNIT_REPORT_NAME || 'resultados-pruebas.xml',
      suite: 'AppColaboradores',
      useBrowserName: false,
      nameFormatter: undefined,
      classNameFormatter: undefined,
      properties: {},
    },

    // cobertura opcional: ns test android --env.codeCoverage
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },

    hostname: '127.0.0.1',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],

    customLaunchers: {
      android: {
        base: 'NS',
        platform: 'android',
      },
      ios: {
        base: 'NS',
        platform: 'ios',
      },
      ios_simulator: {
        base: 'NS',
        platform: 'ios',
        arguments: ['--emulator'],
      },
    },

    singleRun: false,
  };

  if (config._NS && config._NS.env && config._NS.env.codeCoverage) {
    options.reporters = (options.reporters || []).concat(['coverage']);
  }

  config.set(options);
};
