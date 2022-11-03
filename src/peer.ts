import { Peer } from 'peerjs';
var QRCode = require('qrcode');
import jss from 'jss';
import preset from 'jss-preset-default';

jss.setup(preset());

const styles = {
  'peer-connection-notification': {
    position: 'fixed',
    bottom: 5,
    left: '20%',
    textAlign: 'center',
    width: '60%',
    minWidth: 350,
    height: 50,
    color: 'white',
    background: '#31D084',
    border: '2px solid #1D8251',
    borderRadius: 5,
  },
  'qr-container': {
    fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
    '& .open-modal': {
      background: 'none',
      backgroundImage:
        " url('https://www.svgrepo.com/show/311122/qr-code.svg')",
      backgroundSize: 'contain',
      border: 0,
      position: 'absolute',
      right: 10,
      bottom: 10,
      height: 42,
      width: 42,
      transitionDuration: '0.1s',
      '&:hover': {
        cursor: 'pointer',
        opacity: 0.8,
      },
      '&:active': {
        transform: 'scale(0.9)',
        opacity: 0.5,
      },
    },
    '& .modal-back': {
      position: 'absolute',
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      height: '100%',
      left: 0,
      top: 0,
      '& .modal': {
        width: 350,
        height: 320,
        backgroundColor: 'white',
        position: 'absolute',
        left: 'calc(50% - 175px)',
        top: 'calc(50% - 160px)',
        borderRadius: 7.5,
        '& .close-icon': {
          width: 20,
          height: 20,
          backgroundImage:
            "url('https://www.svgrepo.com/show/305186/close.svg')",
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.6,
          },
          '&:active': {
            opacity: 0.3,
            transform: 'scale(0.9)',
          },
        },
        '& .header': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 17.5,
          paddingRight: 17.5,
          height: 50,
          borderBottom: '0.25px solid lightgray',
        },
        '& .container': {
          paddingLeft: 17.5,
          fontSize: 12,
          color: 'gray',
        },
        '& .qr-container': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
  },
};

const { classes } = jss.createStyleSheet(styles).attach();

export class PeerToPeer {
  static Host = class {
    peer: any;

    otherDeviceId: string;
    constructor(otherDeviceId: string) {
      this.otherDeviceId = otherDeviceId;
      this.peer = new Peer();
      this.peer.on('open', () => {
        this.#initialiseQR(this.peer.id);
        console.log(this.peer.id);
      });
      this.peer.on('connection', (conn: any) => {
        conn.on('data', (data: any) => {
          if (data == 'connection-success-esp-tools') {
            this.#showNotification();
          } else {
            console.log(data);
          }
        });
      });
    }

    onData(func: Function) {
      this.peer.on('connection', (conn: any) => {
        conn.on('data', (data: any) => {
          if (data == 'connection-success-esp-tools') {
            this.#showNotification();
          } else {
            func(data);
          }
        });
      });
    }

    #initialiseQR(id: string) {
      let path = `${this.otherDeviceId}?id=${id}`;

      QRCode.toCanvas(
        path,
        { errorCorrectionLevel: 'H' },
        (err: Error, canvas: HTMLCanvasElement) => {
          if (err) throw err;
          var body = document.getElementsByTagName('body')[0];

          var qrcontainer = document.createElement('div');
          qrcontainer.className = classes['qr-container'];

          var open_modal_btn = document.createElement('button');
          open_modal_btn.className = 'open-modal';

          open_modal_btn.onclick = function () {
            let modal_back = document.createElement('div');
            modal_back.className = 'modal-back';

            let modal = document.createElement('div');
            modal.className = 'modal';

            let header = document.createElement('div');
            header.className = 'header';

            let title = document.createElement('p');
            title.innerText = 'Peer to peer';

            let closeIcon = document.createElement('div');
            closeIcon.className = 'close-icon';

            closeIcon.onclick = function () {
              qrcontainer.removeChild(modal_back);
            };

            header.appendChild(title);
            header.appendChild(closeIcon);

            modal.appendChild(header);

            let subTextContainer = document.createElement('div');
            subTextContainer.className = 'container';

            subTextContainer.innerHTML = '<p>Connect to a mobile device</p>';

            modal.appendChild(subTextContainer);

            let qr_container = document.createElement('div');
            qr_container.className = 'qr-container';

            qr_container.appendChild(canvas);

            modal.appendChild(qr_container);

            modal_back.appendChild(modal);

            qrcontainer.appendChild(modal_back);
          };

          qrcontainer.appendChild(open_modal_btn);

          body.appendChild(qrcontainer);
        },
      );
    }

    #showNotification() {
      let root = document.getElementsByTagName('body')[0];
      let statusPopup = document.createElement('div');
      statusPopup.className = classes['peer-connection-notification'];
      statusPopup.innerHTML =
        '<p>Connected to Device: ' + this.peer.id + '</p>';
      root!.appendChild(statusPopup);
      setTimeout(function () {
        statusPopup!.parentElement!.removeChild(statusPopup);
      }, 2000);
    }
  };
  static Connector = class {
    peer: any;
    conn: any;
    constructor() {
      this.peer = new Peer();
      setTimeout(() => {
        this.conn = this.peer.connect(this.#getPeerId(), function (data: any) {
          alert(data);
        });
        this.conn.on('open', () => {
          this.conn.send('connection-success-esp-tools');
        });
      }, 1000);
    }

    #getPeerId(): string {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      return params.id;
    }
  };
}
