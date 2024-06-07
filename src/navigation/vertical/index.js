import React, { useState, useEffect } from 'react';
import config from 'config.js';
import Login from 'mdi-material-ui/Login';
import Table from 'mdi-material-ui/Table';
import CubeOutline from 'mdi-material-ui/CubeOutline';
import HomeOutline from 'mdi-material-ui/HomeOutline';
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase';
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline';
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline';
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline';
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline';
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended';
import Database from 'mdi-material-ui/Database';

const fetchData = async (request, setData) => {
  const query = {
    data: request,
  };

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/datab?${new URLSearchParams(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    setData(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const Navigation = ({ isAuthenticated }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        const session = sessionStorage.getItem('userSession');
        if (session) {
          await fetchData(`SELECT * FROM users WHERE sessionid = '${session}'`, setUserData);
        }
      };
      fetchUserData();
      const interval = setInterval(fetchUserData, 20 * 1000); // Fetch data every 20 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const getNavigationItems = (role) => {
    const commonItems = [
      {
        title: 'Login',
        icon: Login,
        path: '/pages/login',
        openInNewTab: true,
      },
      {
        title: 'Register',
        icon: AccountPlusOutline,
        path: '/pages/register',
        openInNewTab: true,
      },
      {
        title: 'Error',
        icon: AlertCircleOutline,
        path: '/pages/error',
        openInNewTab: true,
      },
      {
        title: 'Icons',
        path: '/icons',
        icon: GoogleCirclesExtended,
      },
    ];

    const roleBasedItems = {
      admin: [
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/pages/dashboard',
        },
        {
          title: 'Manage Inventory',
          icon: Database,
          path: '/pages/manage-inventory',
        },
        {
          title: 'Manage Users',
          icon: AccountCogOutline,
          path: '/pages/manage-users',
        },
      ],
      developer: [
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/pages/dashboard',
        },
        {
          title: 'Manage Inventory',
          icon: Database,
          path: '/pages/manage-inventory',
        },
        {
          title: 'Manage Users',
          icon: AccountCogOutline,
          path: '/pages/manage-users',
        },
        {
          title: 'Typography',
          icon: FormatLetterCase,
          path: '/typography',
        },
        {
          title: 'Tables',
          icon: Table,
          path: '/tables',
        },
        {
          title: 'Cards',
          icon: CreditCardOutline,
          path: '/cards',
        },
        {
          title: 'Form Layouts',
          icon: CubeOutline,
          path: '/form-layouts',
        },
        ...commonItems,
      ],
      manager: [
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/pages/dashboard',
        },
        {
          title: 'Manage Inventory',
          icon: Database,
          path: '/pages/manage-inventory',
        },
      ],
      worker: [
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/pages/dashboard',
        },
      ],
    };

    // Check if role is valid and return the corresponding items or common items
    if (role && roleBasedItems[role.toLowerCase()]) {
      
      return roleBasedItems[role.toLowerCase()];
    }

    return commonItems;
  };

  if (!userData) {
    return [];
  }

  const userRole = userData[0]?.role || 'guest'; // Use 'guest' as a fallback if role is undefined
  
  return getNavigationItems(userRole);
};

export default Navigation;
