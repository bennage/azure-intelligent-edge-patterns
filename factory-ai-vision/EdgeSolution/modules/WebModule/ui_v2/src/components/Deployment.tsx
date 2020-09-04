import React, { useEffect, useState } from 'react';
import { Stack, PrimaryButton, ProgressIndicator, Text, getTheme } from '@fluentui/react';
import { useSelector, useDispatch } from 'react-redux';

import { State } from 'RootStateType';
import { LiveViewContainer } from './LiveViewContainer';
import { Project, Status } from '../store/project/projectTypes';
import { useInterval } from '../hooks/useInterval';
import {
  thunkGetTrainingLog,
  thunkGetInferenceMetrics,
  thunkDeleteProject,
  thunkGetTrainingMetrics,
  thunkGetProject,
} from '../store/project/projectActions';
import { LiveViewInfo } from './LiveviewInfo/LiveviewInfo';
import { selectCameraById } from '../store/cameraSlice';
import { selectTrainingProjectById } from '../store/trainingProjectSlice';
import { selectPartNamesById } from '../store/partSlice';
import { ConfigTaskPanel } from './ConfigTaskPanel';

const { palette } = getTheme();

export const Deployment: React.FC<{ isDemo: boolean }> = ({ isDemo }) => {
  const {
    status,
    progress,
    trainingLogs,
    data: projectData,
    inferenceMetrics: { successRate, successfulInferences, unIdetifiedItems },
  } = useSelector<State, Project>((state) => state.project);
  const { id: projectId, camera: projectCameraId, trainingProject, parts } = projectData;
  const cameraName = useSelector((state: State) => selectCameraById(state, projectCameraId)?.name);
  const trainingProjectName = useSelector(
    (state: State) => selectTrainingProjectById(state, trainingProject)?.name,
  );
  const partNames = useSelector(selectPartNamesById(parts));
  const dispatch = useDispatch();

  const [isEditPanelOpen, setisEditPanelOpen] = useState(false);
  const openPanel = () => setisEditPanelOpen(true);
  const closePanel = () => setisEditPanelOpen(false);

  useEffect(() => {
    dispatch(thunkGetProject());
  }, [dispatch]);

  useInterval(
    () => {
      dispatch(thunkGetTrainingLog(projectId, isDemo));
    },
    status === Status.WaitTraining ? 5000 : null,
  );

  useEffect(() => {
    if (status === Status.FinishTraining) {
      dispatch(thunkGetTrainingMetrics(trainingProject, isDemo));
    }
  }, [dispatch, status, projectId, isDemo, trainingProject]);

  useInterval(
    () => {
      dispatch(thunkGetInferenceMetrics(projectId, isDemo));
    },
    status === Status.StartInference ? 5000 : null,
  );

  const onDeleteProject = (): void => {
    dispatch(thunkDeleteProject(isDemo));
  };

  const onRenderMain = () => {
    if (status === Status.None) return <PrimaryButton onClick={openPanel}>Config Task</PrimaryButton>;
    if (status === Status.WaitTraining)
      return (
        <Stack horizontalAlign="center" verticalAlign="center" grow tokens={{ childrenGap: 24 }}>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 5 }}>
            {progress !== null && (
              <>
                <Text variant="xxLarge">{`${progress}%`}</Text>
                <Text></Text>
              </>
            )}
          </Stack>
          <ProgressIndicator
            barHeight={4}
            styles={{ root: { width: '600px' }, progressBar: { backgroundColor: palette.tealLight } }}
            percentComplete={progress !== null ? progress / 100 : null}
          />
        </Stack>
      );

    return (
      <>
        <div style={{ width: '30%' }}>
          <LiveViewInfo
            taskName={trainingProjectName}
            cameraName={cameraName}
            partNames={partNames}
            successRate={successRate}
            successfulInference={successfulInferences}
            unidentifiedImages={unIdetifiedItems}
          />
        </div>
        <PrimaryButton onClick={openPanel}>Config Task</PrimaryButton>
        <div style={{ height: '90%', width: '70%' }}>
          <LiveViewContainer showVideo={true} cameraId={projectCameraId} onDeleteProject={onDeleteProject} />
        </div>
      </>
    );
  };

  return (
    <>
      <Stack horizontal styles={{ root: { height: '100%' } }}>
        {onRenderMain()}
      </Stack>
      <ConfigTaskPanel isOpen={isEditPanelOpen} onDismiss={closePanel} projectData={projectData} />
    </>
  );
};
