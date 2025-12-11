// API service with conditional mock/Supabase implementation
import { supabase } from './supabaseClient';
import { USE_MOCK_API } from './apiConfig';

// Import mock API functions
import * as mockApiModule from './mockApi';

// Building functions
export const getBuildings = async () => {
  if (USE_MOCK_API) {
    return await mockApiModule.getBuildings();
  } else {
    const { data, error } = await supabase
      .from('buildings')
      .select('*, floors(*), risers(*), images(*), tech_pdfs(*)');
    if (error) throw error;
    return data.map(building => ({
      id: building.id,
      name: building.name,
      address: building.address,
      technologySummary: building.technology_summary,
      complexityPercentage: building.complexity_percentage,
      requiredTechnicians: building.required_technicians,
      parkingType: building.parking_type,
      parkingInstructions: building.parking_instructions,
      floors: building.floors,
      risers: building.risers,
      images: building.images,
      techPDFs: building.tech_pdfs,
    }));
  }
};

export const getBuildingById = async (id) => {
  if (USE_MOCK_API) {
    return await mockApiModule.getBuildingById(id);
  } else {
    const { data, error } = await supabase
      .from('buildings')
      .select('*, floors(*), risers(*), images(*), tech_pdfs(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) throw new Error('Building not found');

    return {
      id: data.id,
      name: data.name,
      address: data.address,
      technologySummary: data.technology_summary,
      complexityPercentage: data.complexity_percentage,
      requiredTechnicians: data.required_technicians,
      parkingType: data.parking_type,
      parkingInstructions: data.parking_instructions,
      floors: data.floors,
      risers: data.risers,
      images: data.images,
      techPDFs: data.tech_pdfs,
    };
  }
};

export const createBuilding = async (buildingData) => {
  if (USE_MOCK_API) {
    return await mockApiModule.createBuilding(buildingData);
  } else {
    // For Supabase, we need to handle the RLS policy issue
    // Get the current user's session to set created_by
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      throw new Error('User not authenticated');
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from('buildings')
      .insert([{
        name: buildingData.name,
        address: buildingData.address,
        technology_summary: buildingData.technologySummary,
        complexity_percentage: buildingData.complexityPercentage,
        required_technicians: buildingData.requiredTechnicians,
        parking_type: buildingData.parkingType,
        parking_instructions: buildingData.parkingInstructions,
        created_by: userId  // Include the user ID
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const updateBuilding = async (id, updatedData) => {
  if (USE_MOCK_API) {
    return await mockApiModule.updateBuilding(id, updatedData);
  } else {
    const { data, error } = await supabase
      .from('buildings')
      .update({
        name: updatedData.name,
        address: updatedData.address,
        technology_summary: updatedData.technologySummary,
        complexity_percentage: updatedData.complexityPercentage,
        required_technicians: updatedData.requiredTechnicians,
        parking_type: updatedData.parkingType,
        parking_instructions: updatedData.parkingInstructions,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const deleteBuilding = async (id) => {
  if (USE_MOCK_API) {
    return await mockApiModule.deleteBuilding(id);
  } else {
    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};

// User functions
export const getMockUsers = async () => {
  if (USE_MOCK_API) {
    return await mockApiModule.getMockUsers();
  } else {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, role, is_active');
    if (error) throw error;
    return data.map(profile => ({
      id: profile.id,
      username: profile.username,
      email: profile.email,
      role: profile.role,
      isActive: profile.is_active,
    }));
  }
};

export const login = async (email, password) => {
  if (USE_MOCK_API) {
    return await mockApiModule.login(email, password);
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, role, is_active')
      .eq('id', data.user.id)
      .single();
    if (profileError) throw new Error(profileError.message);

    if (!profile.is_active) {
      await supabase.auth.signOut();
      throw new Error('User account is inactive.');
    }

    return {
      id: data.user.id,
      email: data.user.email,
      username: profile.username,
      role: profile.role,
      isActive: profile.is_active,
    };
  }
};

export const registerUser = async (newUserData) => {
  if (USE_MOCK_API) {
    return await mockApiModule.registerUser(newUserData);
  } else {
    const { data, error } = await supabase.auth.signUp({
      email: newUserData.email,
      password: newUserData.password,
      options: {
        data: {
          username: newUserData.username,
          role: newUserData.role,
        }
      }
    });
    if (error) throw new Error(error.message);

    return data;
  }
};

// Additional functions
export const addImageToBuilding = async (buildingId, image) => {
  if (USE_MOCK_API) {
    return await mockApiModule.addImageToBuilding(buildingId, image);
  } else {
    const { data, error } = await supabase
      .from('images')
      .insert([{
        building_id: buildingId,
        type: image.type,
        url: image.url,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const removeImageFromBuilding = async (imageId) => {
  if (USE_MOCK_API) {
    return await mockApiModule.removeImageFromBuilding(imageId);
  } else {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);
    if (error) throw error;
    return true;
  }
};

export const addFloorToBuilding = async (buildingId, floor) => {
  if (USE_MOCK_API) {
    return await mockApiModule.addFloorToBuilding(buildingId, floor);
  } else {
    const { data, error } = await supabase
      .from('floors')
      .insert([{
        building_id: buildingId,
        number: floor.number,
        description: floor.description,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const addRiserToBuilding = async (buildingId, riser) => {
  if (USE_MOCK_API) {
    return await mockApiModule.addRiserToBuilding(buildingId, riser);
  } else {
    const { data, error } = await supabase
      .from('risers')
      .insert([{
        building_id: buildingId,
        number: riser.number,
        floors_covered: riser.floorsCovered,
        location_description: riser.locationDescription,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const addPdfToBuilding = async (buildingId, pdf) => {
  if (USE_MOCK_API) {
    return await mockApiModule.addPdfToBuilding(buildingId, pdf);
  } else {
    const { data, error } = await supabase
      .from('tech_pdfs')
      .insert([{
        building_id: buildingId,
        title: pdf.title,
        tech: pdf.tech,
        url: pdf.url,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const removeFloorFromBuilding = async (buildingId, floorId) => {
  if (USE_MOCK_API) {
    return await mockApiModule.removeFloorFromBuilding(buildingId, floorId);
  } else {
    const { error } = await supabase
      .from('floors')
      .delete()
      .eq('id', floorId)
      .eq('building_id', buildingId);
    if (error) throw error;
    return true;
  }
};

export const removeRiserFromBuilding = async (buildingId, riserId) => {
  if (USE_MOCK_API) {
    return await mockApiModule.removeRiserFromBuilding(buildingId, riserId);
  } else {
    const { error } = await supabase
      .from('risers')
      .delete()
      .eq('id', riserId)
      .eq('building_id', buildingId);
    if (error) throw error;
    return true;
  }
};

export const createMockUser = async (userData) => {
  if (USE_MOCK_API) {
    return await mockApiModule.registerUser(userData); // Using registerUser as equivalent for mock
  } else {
    // For Supabase, create a user profile
    const { data: { user: authUser }, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    });

    if (authError) throw new Error(authError.message);

    // Create profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authUser.id,
        username: userData.name,
        email: userData.email,
        role: userData.role,
        is_active: userData.isActive,
      }]);

    if (profileError) throw new Error(profileError.message);

    return {
      id: authUser.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isActive: userData.isActive,
    };
  }
};

export const updateMockUser = async (userId, updatedData) => {
  if (USE_MOCK_API) {
    // For mock, we'll simulate updating by storing in a way that can be retrieved
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));
      return users[userIndex];
    }
    throw new Error('User not found');
  } else {
    // For Supabase, update the profile
    const { error } = await supabase
      .from('profiles')
      .update({
        username: updatedData.name,
        email: updatedData.email,
        role: updatedData.role,
        is_active: updatedData.isActive,
      })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    return {
      id: userId,
      name: updatedData.name,
      email: updatedData.email,
      role: updatedData.role,
      isActive: updatedData.isActive,
    };
  }
};

export const deleteMockUser = async (userId) => {
  if (USE_MOCK_API) {
    // For mock, remove from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return true;
  } else {
    // For Supabase, delete profile and user
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw new Error(profileError.message);

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) throw new Error(authError.message);

    return true;
  }
};

export const findNearestRisers = (building, currentFloor) => {
  if (USE_MOCK_API) {
    return mockApiModule.findNearestRisers(building, currentFloor);
  } else {
    const parseFloorsCovered = (floorsStr) => {
      if (typeof floorsStr !== 'string') return [];
      const ranges = floorsStr.split(',');
      const floors = [];
      ranges.forEach(range => {
        if (range.includes('-')) {
          const [start, end] = range.trim().split('-').map(Number);
          for (let i = start; i <= end; i++) {
            floors.push(i);
          }
        } else {
          floors.push(parseInt(range.trim()));
        }
      });
      return floors;
    };

    const risersWithFloors = building.risers.map(riser => {
      const floors = parseFloorsCovered(riser.floorsCovered);
      return {
        ...riser,
        floorsCoveredArray: floors,
        minFloor: Math.min(...floors),
        maxFloor: Math.max(...floors)
      };
    });

    const above = risersWithFloors
      .filter(r => r.minFloor > currentFloor)
      .sort((a, b) => a.minFloor - b.minFloor)[0] || null;

    const below = risersWithFloors
      .filter(r => r.maxFloor < currentFloor)
      .sort((a, b) => b.maxFloor - a.maxFloor)[0] || null;

    return { above, below };
  }
};