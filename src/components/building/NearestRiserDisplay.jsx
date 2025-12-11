import React from 'react';
import Button from '../ui/Button';

const NearestRiserDisplay = ({ riserInfo }) => {
  const { above, below } = riserInfo;

  return (
    <div className="space-y-3">
      {above ? (
        <div>
          <strong>Nearest Riser Above:</strong> {above.number} (Covers {above.floorsCovered})
          <br />
          <small>{above.location}</small>
          <br />
          <Button variant="outline" size="sm" className="mt-1">View Riser Details</Button>
        </div>
      ) : (
        <p>No riser above.</p>
      )}

      {below ? (
        <div>
          <strong>Nearest Riser Below:</strong> {below.number} (Covers {below.floorsCovered})
          <br />
          <small>{below.location}</small>
          <br />
          <Button variant="outline" size="sm" className="mt-1">View Riser Details</Button>
        </div>
      ) : (
        <p>No riser below.</p>
      )}
    </div>
  );
};

export default NearestRiserDisplay;