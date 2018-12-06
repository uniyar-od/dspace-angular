module.exports = {
  // Angular Universal server settings.
  ui: {
    ssl: false,
    host: 'localhost',
    port: 3000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/'
  },
  // The REST API server settings.
  rest: {
    ssl: true,
    host: 'dspace7.4science.it',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/dspace-spring-rest/api'
  },
  // Caching settings
  cache: {
    // NOTE: how long should objects be cached for by default
    msToLive: 15 * 60 * 1000, // 15 minutes
    // msToLive: 1000, // 15 minutes
    control: 'max-age=60' // revalidate browser
  },
  // Authentications
  auth: {
    target: {
      host: 'https://dspace7.4science.it',
      nameSpace: '',
      page: '/dspace-spring-rest/shib.html'
    }
  },
  // Form settings
  form: {
    // NOTE: Map server-side validators to comparative Angular form validators
    validatorMap: {
      required: 'required',
      regex: 'pattern'
    }
  },
  filters: {
    // NOTE: which filter must be show expanded when Search or MyDSpace page is loaded
    loadOpened: ['namedresourcetype']
  },
  // Notifications
  notifications: {
    rtl: false,
    position: ['top', 'right'],
    maxStack: 8,
    // NOTE: after how many seconds notification is closed automatically. If set to zero notifications are not closed automatically
    timeOut: 5000, // 5 second
    clickToClose: true,
    // NOTE: 'fade' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | 'rotate' | 'scale'
    animate: 'scale'
  },
  // Submission settings
  submission: {
    autosave: {
      // NOTE: which metadata trigger an autosave
      metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
      // NOTE: every how many minutes submission is saved automatically
      timer: 5
    },
    icons: {
      metadata: [
        /**
         * NOTE: example of configuration
         * {
         *    // NOTE: metadata name
         *    name: 'dc.author',
         *    // NOTE: fontawesome (v4.x) icon classes and bootstrap utility classes can be used
         *    style: 'fa-user'
         * }
         */
        {
          // NOTE: metadata name
          name: 'dc.author',
          // NOTE: fontawesome (v4.x) icon classes and bootstrap utility classes can be used
          style: 'fa-user'
        },
        // default configuration
        {
          name: 'default',
          style: ''
        }
      ],
      authority: {
        confidence: [
          /**
           * NOTE: example of configuration
           * {
           *    // NOTE: confidence value
           *    value: 'dc.author',
           *    // NOTE: fontawesome (v4.x) icon classes and bootstrap utility classes can be used
           *    style: 'fa-user'
           * }
           */
          {
            value: 600,
            style: 'text-success'
          },
          {
            value: 500,
            style: 'text-info'
          },
          {
            value: 400,
            style: 'text-warning'
          },
          // default configuration
          {
            value: 'default',
            style: 'text-muted'
          },

        ]
      }
    },
/*    metadata: {
      // NOTE: allow to set icons used to represent metadata belonging to a relation group
      icons: [
        // NOTE: example of configuration
        {
           // NOTE: metadata name
           name: 'dc.author',
           config: {
             // NOTE: used when metadata value has an authority
             withAuthority: {
               // NOTE: fontawesome (v4.x) icon classes and bootstrap color utility classes can be used
               style: 'fa-user'
             },
             // NOTE: used when metadata value has not an authority
             withoutAuthority: {
               style: 'fa-user text-muted'
             }
          }
        },
        // default configuration
        {
          name: 'default',
          config: {}
        }
      ]
    },*/
    detectDuplicate: {
      // NOTE: list of additional item metadata to show for duplicate match presentation list
      metadataDetailsList: [
        { label: 'Document type', name: 'dc.type' },
        { label: 'Source title', name: 'dc.bibliographicCitation.title' }
      ]
    }
  },
  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  },
  // Google Analytics tracking id
  gaTrackingId: '',
  // Log directory
  logDirectory: '.',
  // NOTE: will log all redux actions and transfers in console
  debug: false
};
