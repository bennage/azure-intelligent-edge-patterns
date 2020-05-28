import React, { useState, useEffect, useRef } from 'react';
import * as R from 'ramda';
import Axios from 'axios';

import { Text, Checkbox, Flex, Button, Alert } from '@fluentui/react-northstar';
import { LiveViewScene } from './LiveViewScene';
import { Box } from './LiveViewContainer.type';

export const LiveViewContainer: React.FC<{ showVideo: boolean; initialAOIs: Box[] }> = ({
  showVideo,
  initialAOIs,
}) => {
  const [showAOI, setShowAOI] = useState(true);
  const lasteUpdatedAOIs = useRef(
    initialAOIs.length ? initialAOIs : [{ x1: 100, y1: 100, x2: 2000, y2: 1000 }],
  );
  const [AOIs, setAOIs] = useState<Box[]>(lasteUpdatedAOIs.current);
  const [showUpdateSuccessTxt, setShowUpdateSuccessTxt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const onCheckboxClick = async (): Promise<void> => {
    setShowAOI((prev) => !prev);
    setLoading(true);
    try {
      await Axios.post('', {});
      setShowUpdateSuccessTxt(true);
    } catch (e) {
      // Set back to the state before updating for switch case
      setShowAOI(showAOI);
      setError(e);
    }
    setLoading(false);
  };

  const onUpdate = async (): Promise<void> => {
    setLoading(true);
    try {
      await Axios.post('', {});
      setShowUpdateSuccessTxt(true);
      lasteUpdatedAOIs.current = R.clone(AOIs);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showUpdateSuccessTxt) {
      const timer = setTimeout(() => {
        setShowUpdateSuccessTxt(false);
      }, 3000);
      return (): void => clearTimeout(timer);
    }
  }, [showUpdateSuccessTxt]);

  const hasEdit = !R.equals(lasteUpdatedAOIs.current, AOIs);
  const updateBtnDisabled = !showAOI || !hasEdit;

  return (
    <Flex column gap="gap.medium">
      <Text styles={{ width: '150px' }} size="large">
        Live View:
      </Text>
      {error && <Alert danger header="Failed to Update!" content={`${error.name}: ${error.message}`} />}
      <Flex hAlign="end" gap="gap.small" vAlign="center">
        <Checkbox
          labelPosition="start"
          label="Show area of interest"
          toggle
          checked={showAOI}
          onClick={onCheckboxClick}
        />
        <Button content="Update" primary disabled={updateBtnDisabled} onClick={onUpdate} loading={loading} />
        <Text styles={{ visibility: showUpdateSuccessTxt ? 'visible' : 'hidden' }}>Updated!</Text>
      </Flex>
      <div style={{ width: '100%', height: '600px', backgroundColor: 'black' }}>
        {showVideo ? <LiveViewScene AOIs={AOIs} setAOIs={setAOIs} visible={showAOI} /> : null}
      </div>
    </Flex>
  );
};
