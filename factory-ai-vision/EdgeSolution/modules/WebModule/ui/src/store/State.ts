import { Camera } from './camera/cameraTypes';
import { Notification } from '../reducers/type';
import { Project, Status } from './project/projectTypes';
import { Setting } from './setting/settingType';

export interface State {
  // Domain Data
  parts?: any;
  locations?: any;
  notifications: Notification[];
  labelImages?: any;
  annotations?: any;
  // App State
  labelingPage?: any;
  // TODO: Refactor
  cameras: Camera[];
  project: Project;
  demoProject: Project;
  setting: Setting;
}

const initialProject: Project = {
  isLoading: false,
  data: {
    id: null,
    camera: null,
    location: null,
    parts: [],
    needRetraining: true,
    accuracyRangeMin: 60,
    accuracyRangeMax: 80,
    maxImages: 20,
    modelUrl: '',
    sendMessageToCloud: false,
    framesPerMin: 6,
    accuracyThreshold: 50,
    probThreshold: '10',
  },
  originData: {
    id: null,
    camera: null,
    location: null,
    parts: [],
    needRetraining: true,
    accuracyRangeMin: 60,
    accuracyRangeMax: 80,
    maxImages: 50,
    modelUrl: '',
    sendMessageToCloud: false,
    framesPerMin: 6,
    accuracyThreshold: 50,
    probThreshold: '10',
  },
  trainingMetrics: {
    prevConsequence: null,
    curConsequence: null,
  },
  inferenceMetrics: {
    successRate: null,
    successfulInferences: null,
    unIdetifiedItems: null,
    isGpu: false,
    averageTime: null,
  },
  progress: null,
  status: Status.None,
  error: null,
  trainingLogs: [],
};

export const initialState: State = {
  cameras: [],
  project: initialProject,
  demoProject: initialProject,
  setting: {
    loading: false,
    error: null,
    current: {
      id: -1,
      key: '',
      namespace: '',
    },
    origin: {
      id: -1,
      key: '',
      namespace: '',
    },
    isTrainerValid: true,
    appInsightHasInit: true,
    isCollectData: false,
    appInsightKey: '',
  },
  notifications: [],
};
