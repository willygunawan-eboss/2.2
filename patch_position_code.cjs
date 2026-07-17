const fs = require('fs');

// 1. Position.ts
let posDomain = fs.readFileSync('src/services/position/domain/Position.ts', 'utf8');
posDomain = posDomain.replace('jobGrade: string | null;\n  jobFamily: string | null;\n  jobLevel: string | null;', 'jobId: string | null;');
posDomain = posDomain.replace('jobGrade: string | null,\n    jobFamily: string | null,\n    jobLevel: string | null,', 'jobId: string | null,');
posDomain = posDomain.replace('jobGrade,\n      jobFamily,\n      jobLevel,', 'jobId,');
posDomain = posDomain.replace('get jobGrade(): string | null { return this.props.jobGrade; }\n  get jobFamily(): string | null { return this.props.jobFamily; }\n  get jobLevel(): string | null { return this.props.jobLevel; }', 'get jobId(): string | null { return this.props.jobId; }');
posDomain = posDomain.replace('public updateDetails(name: string, jobGrade: string | null, jobFamily: string | null, jobLevel: string | null, employmentType: string | null) {', 'public updateDetails(name: string, jobId: string | null, employmentType: string | null) {');
posDomain = posDomain.replace('this.props.jobGrade = jobGrade;\n    this.props.jobFamily = jobFamily;\n    this.props.jobLevel = jobLevel;', 'this.props.jobId = jobId;');
fs.writeFileSync('src/services/position/domain/Position.ts', posDomain);

// 2. PositionRepositoryImpl.ts
let posRepo = fs.readFileSync('src/services/position/repository/PositionRepositoryImpl.ts', 'utf8');
posRepo = posRepo.replace('jobGrade: position.jobGrade,\n      jobFamily: position.jobFamily,\n      jobLevel: position.jobLevel,', 'jobId: position.jobId,');
posRepo = posRepo.replace('jobGrade: position.jobGrade,\n        jobFamily: position.jobFamily,\n        jobLevel: position.jobLevel,', 'jobId: position.jobId,');
posRepo = posRepo.replace('record.jobGrade,\n      record.jobFamily,\n      record.jobLevel,', 'record.jobId,');
fs.writeFileSync('src/services/position/repository/PositionRepositoryImpl.ts', posRepo);

// 3. PositionDTO.ts
let posDTO = fs.readFileSync('src/services/position/application/dto/PositionDTO.ts', 'utf8');
posDTO = posDTO.replace('jobGrade?: string | null;\n  jobFamily?: string | null;\n  jobLevel?: string | null;', 'jobId?: string | null;');
posDTO = posDTO.replace('jobGrade?: string | null;\n  jobFamily?: string | null;\n  jobLevel?: string | null;', 'jobId?: string | null;');
posDTO = posDTO.replace('jobGrade: string | null;\n  jobFamily: string | null;\n  jobLevel: string | null;', 'jobId: string | null;');
fs.writeFileSync('src/services/position/application/dto/PositionDTO.ts', posDTO);

// 4. PositionMapper.ts
let posMapper = fs.readFileSync('src/services/position/application/dto/PositionMapper.ts', 'utf8');
posMapper = posMapper.replace('jobGrade: domain.jobGrade,\n      jobFamily: domain.jobFamily,\n      jobLevel: domain.jobLevel,', 'jobId: domain.jobId,');
fs.writeFileSync('src/services/position/application/dto/PositionMapper.ts', posMapper);

// 5. PositionApplicationService.ts
let posSvc = fs.readFileSync('src/services/position/application/PositionApplicationService.ts', 'utf8');
posSvc = posSvc.replace('dto.jobGrade || null,\n        dto.jobFamily || null,\n        dto.jobLevel || null,', 'dto.jobId || null,');
posSvc = posSvc.replace('dto.jobGrade !== undefined ? dto.jobGrade : position.jobGrade,\n        dto.jobFamily !== undefined ? dto.jobFamily : position.jobFamily,\n        dto.jobLevel !== undefined ? dto.jobLevel : position.jobLevel,', 'dto.jobId !== undefined ? dto.jobId : position.jobId,');
fs.writeFileSync('src/services/position/application/PositionApplicationService.ts', posSvc);

// 6. positionPlatformRoutes.ts
let posRoutes = fs.readFileSync('src/routes/positionPlatformRoutes.ts', 'utf8');
posRoutes = posRoutes.replace('jobGrade: z.string().nullable().optional(),\n  jobFamily: z.string().nullable().optional(),\n  jobLevel: z.string().nullable().optional(),', 'jobId: z.string().nullable().optional(),');
posRoutes = posRoutes.replace('jobGrade: z.string().nullable().optional(),\n  jobFamily: z.string().nullable().optional(),\n  jobLevel: z.string().nullable().optional(),', 'jobId: z.string().nullable().optional(),');
fs.writeFileSync('src/routes/positionPlatformRoutes.ts', posRoutes);

// 7. PositionApplicationService.test.ts
let posTest = fs.readFileSync('src/services/position/application/PositionApplicationService.test.ts', 'utf8');
posTest = posTest.replace("Position.create('pos-1', 'POS-001', 'Software Engineer', null, null, null, null, null, 'ACTIVE', '2026-07-01')", "Position.create('pos-1', 'POS-001', 'Software Engineer', null, null, null, 'ACTIVE', '2026-07-01')");
fs.writeFileSync('src/services/position/application/PositionApplicationService.test.ts', posTest);

