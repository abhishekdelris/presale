'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserList from '@/components/admin/UserList';
import Sidebar from '@/components/layout/Sidebar';

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      if (!session.user.roles.includes('admin')) {
        router.push('/user/profile');
        return;
      }
      
      // Fetch users
      fetchUsers();
    }
  }, [status, session, router]);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserRoles = async (userId, roles) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, roles }),
      });
      
      if (response.ok) {
        // Refresh the user list
        fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update user roles:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the user list
        fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
}