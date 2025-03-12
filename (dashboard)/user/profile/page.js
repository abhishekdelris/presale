'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/components/user/ProfileForm';
import Sidebar from '@/components/layout/Sidebar';

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status, session, router]);
  
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: "Failed to update profile" };
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex">
      <Sidebar 
        isAdmin={false}
        links={[
          { href: '/user/profile', label: 'Profile' },
          { href: '/user/settings', label: 'Settings' },
        ]}
      />
      
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        {userProfile ? (
          <ProfileForm 
            initialData={userProfile} 
            onSubmit={updateProfile} 
          />
        ) : (
          <div className="bg-yellow-100 p-4 rounded">
            Could not load your profile. Please try again later.
          </div>
        )}
        
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div>
            <p><strong>Email:</strong> {session?.user?.email}</p>
            <p><strong>Role:</strong> {session?.user?.roles?.join(', ')}</p>
            <p><strong>Member Since:</strong> {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </main>
    </div>
  );
}