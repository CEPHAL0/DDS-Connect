import { createDataSource } from './data.source';

const ConfigService = require('@nestjs/common');

const myConfigService = new ConfigService();

const dataSourceOptions = createDataSource(myConfigService);

export default dataSourceOptions;
