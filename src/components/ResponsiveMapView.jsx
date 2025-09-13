import React from 'react';
import { useMobile } from '../hooks/useMobile';
import MapView from './MapView';
import MobileMapView from './MobileMapView';

export default function ResponsiveMapView(props) {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileMapView {...props} />;
  }
  
  return <MapView {...props} />;
}
