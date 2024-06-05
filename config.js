import AccountTieOutline from 'mdi-material-ui/AccountTieOutline'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import AccountHardHatOutline from 'mdi-material-ui/AccountHardHat'
import ShieldAccount from 'mdi-material-ui/ShieldAccount'
import AccountWrench from 'mdi-material-ui/AccountWrench'
// config.js
const config = {
    apiBaseUrl: 'full-stackapp-qapjxq3dy-beastdev12s-projects.vercel.app',
    apiBasePort: 3001,
    rolekey : {
      Admin: { color: 'primary', icon: <ShieldAccount/>},
      Developer: { color: 'info', icon: <AccountWrench/> },
      Manager: { color: 'success', icon: <AccountTieOutline/>  },
      Worker: { color: 'warning', icon: <AccountHardHatOutline/>  },
      notAssigned: { color: 'error', icon: <AccountWrench/> }
    }
  };
  
export default config;
  
