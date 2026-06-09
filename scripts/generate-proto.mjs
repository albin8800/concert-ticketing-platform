
 import { execSync } from 'child_process';
 import { join } from 'path';
 import { readdirSync, mkdirSync, existsSync } from 'fs';

 const PROTO_DIR = './proto';
 const OUT_DIR = './libs/proto-types/src';

 if (!existsSync(OUT_DIR)) {
   mkdirSync(OUT_DIR, { recursive: true });
    }
   
    const protoFiles = readdirSync(PROTO_DIR).filter(file => file.endsWith('.proto'));
   
    protoFiles.forEach(file => {
      const inputPath = join(PROTO_DIR, file);
      const command = [
        'npx protoc',
        `--plugin=protoc-gen-ts_proto=.\\node_modules\\.bin\\protoc-gen-ts_proto.cmd`,
        `--ts_proto_out=${OUT_DIR}`,
        `--ts_proto_opt=nestJs=true`,
        `--ts_proto_opt=fileDescriptor=false`,
        `--proto_path=${PROTO_DIR}`,
        inputPath
      ].join(' ');
   
      try {
        execSync(command);
        console.log(`✅ Generated: ${file}`);
      } catch (error) {
        console.error(`❌ Failed: ${file}`, error.message);
      }
    });