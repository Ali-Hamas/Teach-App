import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBuildingById } from '../services/api';
import Card from '../components/ui/Card';
import BottomNav from '../components/ui/BottomNav';
import BackButton from '../components/ui/BackButton';
import Button from '../components/ui/Button';

const PDFViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuilding = async () => {
      setLoading(true);
      try {
        const data = await getBuildingById(id);
        if (data) {
          setBuilding(data);
        } else {
          setError('Building not found.');
        }
      } catch (err) {
        setError('Failed to fetch building data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuilding();
  }, [id]);

  if (loading) {
    return (
      <div className="full-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="full-screen bg-dark flex flex-col items-center justify-center p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate('/buildings')} className="mt-4">
          Back to Buildings
        </Button>
      </div>
    );
  }

  if (!building) {
    return <div className="text-center mt-10">No building found.</div>;
  }

  return (
    <div className="full-screen bg-dark flex flex-col">
      <div className="p-4 flex-grow overflow-y-auto relative pt-12">
        <div className="absolute top-4 left-4 z-10">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold mb-4">ONT Configuration Documents – {building.name}</h1>

        <div className="space-y-4">
          {building.techPDFs && building.techPDFs.length > 0 ? (
            building.techPDFs.map(pdf => (
              <Card key={pdf.id} className="mockup-card">
                <h3 className="mockup-card-header">{pdf.title}</h3>
                <p className="text-gray-400 mb-2">Tech: {pdf.tech}</p>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="btn-mockup" onClick={() => window.open(pdf.url, '_blank')}>
                    OPEN PDF
                  </Button>
                  <Button variant="outline" size="sm" className="btn-mockup-outline" onClick={() => {
                    const link = document.createElement('a');
                    link.href = pdf.url;
                    link.download = pdf.title.replace(/\s+/g, '_') + '.pdf';
                    link.click();
                  }}>
                    DOWNLOAD
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-400">No PDF documents available for this building.</p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default PDFViewerPage;