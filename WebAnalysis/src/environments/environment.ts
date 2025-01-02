export const environment = {
  production: true,
  //urlApi: 'https://www.ipt-tanzu.com/api',
  //urlApi: "https://fusion-api.azurewebsites.net/api",
  urlApi: 'https://localhost:7071/api',
  routeApi: {
    media: {
      live: 'Media/live',
      html: 'Media/html',
      audio: 'Media/audio',
    },
  },
  footer: {
    buttonModal: {
      width: '230px',
      panelClass: 'dialog-settings',
      backdropClass: 'bg-none',
      settings: {
        position: {
          right: '10px',
          top: '40px',
        },
      },
      live: {
        position: {
          right: '40px',
          bottom: '40px',
        },
      },
      speech: {
        position: {
          right: '90px',
          bottom: '40px',
        },
      },
    },
  },
  gridster: {
    fixedColWidth: 105,
    fixedRowHeight: 105,
    margin: 10,
  },
  widgets: {
    grid: {
      title: 'Interception',
      closable: false,
    },
    metadata: {
      title: 'Metadata',
      closable: true,
    },
    playerAudio: {
      title: 'Audio Player',
      closable: false,
      skipLength: 3,
      timeLine: {
        height: 20,
        fontSize: 12,
      },
    },
    playerVideo: {
      title: 'Video Player',
      closable: true,
    },
    note: {
      title: 'Note',
      closable: true,
    },
    transcription: {
      title: 'Transcription',
      closable: true,
    },
    map: {
      title: 'Maps',
      closable: true,
    },
    pdf: {
      title: 'Viewer',
      closable: true,
    },
    mywidget: {
      // To delete
      title: 'My Widget',
      closable: true,
    },
    identities: {
      title: 'Identities',
      closable: true,
    },
    layout: {
      heightToolbar: 32,
    },
  },
  live: {
    //urlR: 'https://www.ipt-tanzu.com/lives',
    urlR: 'https://fusion-api.azurewebsites.net/lives',
    url: 'https://localhost/.well-known/mercure',
    heartbeatTimeout: 60 * 60 * 1000,
    hideTimeout: 60 * 1000,
    interval: 1000 * 20,
  },
  apps: {
    analyze: {
      name: 'Analyze',
      tabName: 'Analyze',
      type: 'ANALYZE',
      priority: 0,
      disabled: false,
      icon: 'pi-chart-bar',
      items: null,
    },
    cdr: {
      name: 'CDR',
      tabName: 'CDR',
      type: 'CDR',
      priority: 1,
      disabled: true,
      icon: 'pi-objects-column',
      items: null,
    },
    provisioning2: {
      name: 'Provisioning',
      tabName: 'Provisioning',
      type: 'PROVISIONING2',
      priority: 2,
      disabled: true,
      icon: 'pi-mobile',
      items: null,
    },
    userAdmin: {
      name: 'User Administration',
      tabName: 'User Administration',
      type: 'USER_ADMIN',
      priority: 3,
      disabled: true,
      icon: 'pi-users',
      items: null,
    },
    sla: {
      name: 'Services-level Agreement',
      tabName: 'SLA',
      type: 'SLA',
      priority: 4,
      disabled: true,
      icon: 'pi-server',
      items: null,
    },
    systemAdmin: {
      name: 'System Administration',
      tabName: 'System Administration',
      type: 'SYSTEM_ADMIN',
      priority: 5,
      disabled: true,
      icon: 'pi-cog',
      items: [
        {
          name: 'Provisioning',
          tabName: 'Provisioning',
          type: 'PROVISIONING',
          priority: 2,
          disabled: false,
        },
      ],
    },
  },
};
