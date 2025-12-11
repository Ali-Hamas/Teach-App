import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBuildings } from '../services/api'; // Fetch buildings to link PDFs
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import BottomNav from '../components/ui/BottomNav';

const ManagePDFs = () => {
  const { user } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [newPdf, setNewPdf] = useState({ title: '', tech: 'Huawei', url: '' }); // Simplified for mock

  useEffect(() => {
    const fetchBuildings = async () => {
      const data = await getBuildings(); // Fetch from API
      setBuildings(data);
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuildingId) {
      const building = buildings.find(b => b.id === selectedBuildingId);
      if (building) {
        setPdfs(building.techPDFs || []);
      }
    } else {
        setPdfs([]);
    }
  }, [selectedBuildingId, buildings]);

  if (user?.role !== 'Admin') {
    return <div className="text-center mt-10">Access Denied. Admins Only.</div>;
  }

  const handleAddPdf = () => {
    if (!selectedBuildingId || !newPdf.title || !newPdf.url) return; // Basic validation
    // Mock update - find building and add PDF
    const updatedBuildings = buildings.map(b => {
      if (b.id === selectedBuildingId) {
        const newPdfObj = { id: `p${b.techPDFs.length + 1}`, title: newPdf.title, tech: newPdf.tech, url: newPdf.url };
        return { ...b, techPDFs: [...(b.techPDFs || []), newPdfObj] };
      }
      return b;
    });
    setBuildings(updatedBuildings);
    setPdfs([...pdfs, { id: `p${pdfs.length + 1}`, title: newPdf.title, tech: newPdf.tech, url: newPdf.url }]);
    setNewPdf({ title: '', tech: 'Huawei', url: '' });
  };

  const handleDeletePdf = (pdfId) => {
    const updatedBuildings = buildings.map(b => {
      if (b.id === selectedBuildingId) {
        return { ...b, techPDFs: b.techPDFs.filter(p => p.id !== pdfId) };
      }
      return b;
    });
    setBuildings(updatedBuildings);
    setPdfs(pdfs.filter(p => p.id !== pdfId));
  };

  return (
    <div className="full-screen bg-dark flex flex-col">
      <div className="p-4 flex-grow overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Technology PDFs</h1>

        <select
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuildingId(e.target.value)}
          className="input-mockup mb-4 w-full"
        >
          <option value="">Select a Building</option>
          {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        {selectedBuildingId && (
          <>
            <Card className="mockup-card mb-4">
              <h3 className="mockup-card-header">Add PDF to {buildings.find(b => b.id === selectedBuildingId)?.name}</h3>
              <Input label="PDF Title" value={newPdf.title} onChange={(e) => setNewPdf({...newPdf, title: e.target.value})} />
              <select
                value={newPdf.tech}
                onChange={(e) => setNewPdf({...newPdf, tech: e.target.value})}
                className="input-mockup mb-2"
              >
                <option value="Huawei">Huawei</option>
                <option value="Nokia">Nokia</option>
                <option value="SmartOLT">SmartOLT</option>
                <option value="U2000">U2000</option>
                <option value="Positron">Positron</option>
                <option value="Other">Other</option>
              </select>
              <Input label="PDF URL" value={newPdf.url} onChange={(e) => setNewPdf({...newPdf, url: e.target.value})} />
              <Button onClick={handleAddPdf} className="btn-mockup mt-2">Add PDF</Button>
            </Card>

            <h2 className="text-xl font-bold mt-4 mb-2">PDFs</h2>
            <div className="space-y-2">
              {pdfs.map(pdf => (
                <Card key={pdf.id} className="mockup-card flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{pdf.title}</h3>
                    <p className="text-sm text-gray-400">Tech: {pdf.tech}</p>
                  </div>
                  <div className="flex gap-2">
                      <Button onClick={() => window.open(pdf.url, '_blank')} className="btn-mockup-outline text-xs">View</Button>
                      <Button onClick={() => handleDeletePdf(pdf.id)} className="btn-mockup-outline text-xs bg-red-600 hover:bg-red-700">Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ManagePDFs;