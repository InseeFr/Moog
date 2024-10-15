import React from 'react';
import packageJson from '../../../package.json';

const VersionComponent = () => <div className="moog-version">{packageJson.version}</div>;

export default VersionComponent;
