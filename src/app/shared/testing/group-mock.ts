import { Group } from '../../core/eperson/models/group.model';
import { EPersonMock } from './eperson.mock';

export const GroupMock2: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [],
    epersons: [],
    permanent: true,
    selfRegistered: false,
    _links: {
        self: {
            href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2',
        },
        subgroups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2/subgroups' },
        epersons: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2/epersons' }
    },
    _name: 'testgroupname2',
    id: 'testgroupid2',
    uuid: 'testgroupid2',
    type: 'group',
});

export const GroupMock: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [GroupMock2],
    epersons: [EPersonMock],
    selfRegistered: false,
    permanent: false,
    _links: {
        self: {
            href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid',
        },
        subgroups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/subgroups' },
        epersons: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/epersons' }
    },
    _name: 'testgroupname',
    id: 'testgroupid',
    uuid: 'testgroupid',
    type: 'group',
});

export const RoleGroupMock: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [],
    epersons: [],
    selfRegistered: false,
    permanent: false,
    _links: {
        self: {
            href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/87faa00b-c23a-4105-a120-8e8dbc99d51d',
        },
        subgroups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/87faa00b-c23a-4105-a120-8e8dbc99d51d/subgroups' },
        epersons: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/87faa00b-c23a-4105-a120-8e8dbc99d51d/epersons' }
    },
    _name: 'User Role',
    id: '87faa00b-c23a-4105-a120-8e8dbc99d51d',
    uuid: '87faa00b-c23a-4105-a120-8e8dbc99d51d',
    type: 'group',
});

export const RoleGroupMock2: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [],
    epersons: [],
    selfRegistered: false,
    permanent: false,
    _links: {
        self: {
            href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/75a2116f-9bd0-4a07-b529-8ed3267cfe12',
        },
        subgroups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/75a2116f-9bd0-4a07-b529-8ed3267cfe12/subgroups' },
        epersons: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/75a2116f-9bd0-4a07-b529-8ed3267cfe12/epersons' }
    },
    _name: 'Admin Role',
    id: '75a2116f-9bd0-4a07-b529-8ed3267cfe12',
    uuid: '75a2116f-9bd0-4a07-b529-8ed3267cfe12',
    type: 'group',
});
