// 'use client';

// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import DashboardStats from '@/components/admin/DashboardStats';
// import Sidebar from '@/components/layout/Sidebar';

// export default function AdminDashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     newUsersThisWeek: 0,
//     adminCount: 0
//   });
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     // Redirect if not authenticated or not admin
//     if (status === 'unauthenticated') {
//       router.push('/login');
//       return;
//     }
    
//     if (status === 'authenticated') {
//       if (!session.user.roles.includes('admin')) {
//         router.push('/user/profile');
//         return;
//       }
      
//       // Fetch dashboard stats
//       fetchDashboardStats();
//     }
//   }, [status, session, router]);
  
//   const fetchDashboardStats = async () => {
//     try {
//       const response = await fetch('/api/admin/dashboard');
//       if (response.ok) {
//         const data = await response.json();
//         setStats(data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch dashboard stats:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   if (status === 'loading' || loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="flex">
//       <Sidebar 
//         isAdmin={true}
//         links={[
//           { href: '/admin/dashboard', label: 'Dashboard' },
//           { href: '/admin/users', label: 'Manage Users' },
//         ]}
//       />
      
//       <main className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
//         <DashboardStats stats={stats} />
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//           <div className="bg-white p-6 rounded shadow">
//             <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//             {/* Recent activity content would go here */}
//             <p>No recent activity to display</p>
//           </div>
          
//           <div className="bg-white p-6 rounded shadow">
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//             <div className="flex flex-col space-y-2">
//               <button 
//                 onClick={() => router.push('/admin/users')}
//                 className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//               >
//                 Manage Users
//               </button>
//               <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
//                 Generate Reports
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardStats from '@/components/admin/DashboardStats';
import Sidebar from '@/components/layout/Sidebar';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisWeek: 0,
    adminCount: 0
  });
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
      
      // Fetch dashboard stats
      fetchDashboardStats();
    }
  }, [status, session, router]);
  
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
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
        isAdmin={true}
        links={[
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/users', label: 'Manage Users' },
        ]}
      />
      
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <DashboardStats stats={stats} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {/* Recent activity content would go here */}
            <p>No recent activity to display</p>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => router.push('/admin/users')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Manage Users
              </button>
              <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Generate Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}