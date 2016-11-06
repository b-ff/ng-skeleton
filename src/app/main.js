// Main file for connecting all js into one bundle via Webpack

// Main styles
import '../style/main.less';

// Main app file
import './app';

// App configuration
import './config';

// Services
import './services/wsService';

// Components
import './components/navigation/navigation';
import './components/table-list/table-list';