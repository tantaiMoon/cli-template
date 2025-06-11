DROP TABLE IF EXISTS "menu_meta";
DROP SEQUENCE IF EXISTS menu_meta_id_seq;
CREATE SEQUENCE menu_meta_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."menu_meta"
(
    "id"         integer      DEFAULT nextval('menu_meta_id_seq') NOT NULL,
    "title"      text,
    "layout"     text,
    "order"      integer      DEFAULT '100',
    "hidden"     boolean      DEFAULT false                       NOT NULL,
    "disabled"   boolean      DEFAULT false                       NOT NULL,
    "icon"       text,
    "menu_id"    integer                                          NOT NULL,
    "created_at" timestamp(0) DEFAULT CURRENT_TIMESTAMP           NOT NULL,
    "updated_at" timestamp(0)                                     NOT NULL,
    CONSTRAINT "menu_meta_menu_id_key" UNIQUE ("menu_id"),
    CONSTRAINT "menu_meta_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "menus";
DROP SEQUENCE IF EXISTS menus_id_seq;
CREATE SEQUENCE menus_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."menus"
(
    "id"         integer      DEFAULT nextval('menus_id_seq') NOT NULL,
    "name"       text                                         NOT NULL,
    "path"       text                                         NOT NULL,
    "label"      text                                         NOT NULL,
    "component"  text,
    "redirect"   text,
    "fullPath"   text,
    "alias"      text,
    "parent_id"  integer,
    "created_at" timestamp(0) DEFAULT CURRENT_TIMESTAMP       NOT NULL,
    "updated_at" timestamp(0)                                 NOT NULL,
    CONSTRAINT "menus_name_key" UNIQUE ("name"),
    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "policy_permissions";
CREATE TABLE "public"."policy_permissions"
(
    "permission_id" integer                                NOT NULL,
    "policy_id"     integer                                NOT NULL,
    "created_at"    timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at"    timestamp(0)                           NOT NULL,
    CONSTRAINT "policy_permissions_pkey" PRIMARY KEY ("policy_id", "permission_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "permissions";
DROP SEQUENCE IF EXISTS permissions_id_seq;
CREATE SEQUENCE permissions_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."permissions"
(
    "id"          integer      DEFAULT nextval('permissions_id_seq') NOT NULL,
    "name"        text                                               NOT NULL,
    "action"      text                                               NOT NULL,
    "description" text,
    "created_at"  timestamp(0) DEFAULT CURRENT_TIMESTAMP             NOT NULL,
    "updated_at"  timestamp(0)                                       NOT NULL,
    CONSTRAINT "permissions_name_key" UNIQUE ("name"),
    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "policies";
DROP SEQUENCE IF EXISTS policies_id_seq;
CREATE SEQUENCE policies_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."policies"
(
    "id"          integer      DEFAULT nextval('policies_id_seq') NOT NULL,
    "type"        integer                                         NOT NULL,
    "effect"      text                                            NOT NULL,
    "action"      text                                            NOT NULL,
    "subject"     text                                            NOT NULL,
    "fields"      jsonb,
    "conditions"  jsonb,
    "args"        jsonb,
    "fields_data" text,
    "description" text,
    "encode"      character varying(500)                          NOT NULL,
    "created_at"  timestamp(0) DEFAULT CURRENT_TIMESTAMP          NOT NULL,
    "updated_at"  timestamp(0)                                    NOT NULL,
    CONSTRAINT "policies_encode_key" UNIQUE ("encode"),
    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "role_menus";
CREATE TABLE "public"."role_menus"
(
    "role_id"    integer                                NOT NULL,
    "menu_id"    integer                                NOT NULL,
    "created_at" timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(0)                           NOT NULL,
    CONSTRAINT "role_menus_pkey" PRIMARY KEY ("role_id", "menu_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "role_permissions";
CREATE TABLE "public"."role_permissions"
(
    "role_id"       integer                                NOT NULL,
    "permission_id" integer                                NOT NULL,
    "created_at"    timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at"    timestamp(0)                           NOT NULL,
    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id")
) WITH (oids = false);



DROP TABLE IF EXISTS "role_policies";
CREATE TABLE "public"."role_policies"
(
    "role_id"    integer                                NOT NULL,
    "policy_id"  integer                                NOT NULL,
    "created_at" timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(0)                           NOT NULL,
    CONSTRAINT "role_policies_pkey" PRIMARY KEY ("role_id", "policy_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "roles";
DROP SEQUENCE IF EXISTS roles_id_seq;
CREATE SEQUENCE roles_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."roles"
(
    "id"          integer      DEFAULT nextval('roles_id_seq') NOT NULL,
    "name"        text                                         NOT NULL,
    "code"        text                                         NOT NULL,
    "description" text,
    "created_at"  timestamp(0) DEFAULT CURRENT_TIMESTAMP       NOT NULL,
    "updated_at"  timestamp(0)                                 NOT NULL,
    CONSTRAINT "roles_code_key" UNIQUE ("code"),
    CONSTRAINT "roles_name_key" UNIQUE ("name"),
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "user_roles";
CREATE TABLE "public"."user_roles"
(
    "user_id"    integer                                NOT NULL,
    "role_id"    integer                                NOT NULL,
    "created_at" timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(0)                           NOT NULL,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users"
(
    "id"         integer      DEFAULT nextval('users_id_seq') NOT NULL,
    "username"   text                                         NOT NULL,
    "password"   text                                         NOT NULL,
    "age"        integer,
    "name"       text,
    "type"       integer      DEFAULT '0'                     NOT NULL,
    "expired"    timestamp(3),
    "status"     integer      DEFAULT '0'                     NOT NULL,
    "phone"      text,
    "email"      text,
    "unionid"    text,
    "openid"     text,
    "created_at" timestamp(0) DEFAULT CURRENT_TIMESTAMP       NOT NULL,
    "updated_at" timestamp(0)                                 NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_username_key" UNIQUE ("username")
) WITH (oids = false);


-- ----------- 数据

INSERT INTO "permissions" ("id", "name", "action", "description", "created_at", "updated_at")
VALUES (1, 'user:delete', 'delete', '用户删除操作权限', '2025-03-11 07:08:36', '2025-03-11 07:08:36'),
       (2, 'user:read', 'read', '', '2025-03-11 07:08:48', '2025-03-11 07:08:48'),
       (3, 'user:create', 'create', '', '2025-03-11 07:08:58', '2025-03-11 07:08:58'),
       (4, 'user:update', 'update', '', '2025-03-11 07:09:07', '2025-03-11 07:09:07'),
       (5, 'menu:delete', 'delete', '', '2025-03-11 07:08:36', '2025-03-11 07:08:36'),
       (6, 'menu:read', 'read', '', '2025-03-11 07:08:48', '2025-03-11 07:08:48'),
       (7, 'menu:create', 'create', '', '2025-03-11 07:08:58', '2025-03-11 07:08:58'),
       (8, 'menu:update', 'update', '', '2025-03-11 07:09:07', '2025-03-11 07:09:07'),
       (9, 'policy:delete', 'delete', '', '2025-03-11 07:08:36', '2025-03-11 07:08:36'),
       (10, 'policy:read', 'read', '', '2025-03-11 07:08:48', '2025-03-11 07:08:48'),
       (11, 'policy:create', 'create', '', '2025-03-11 07:08:58', '2025-03-11 07:08:58'),
       (12, 'policy:update', 'update', '', '2025-03-11 07:09:07', '2025-03-11 07:09:07'),
       (13, 'permission:delete', 'delete', '', '2025-03-11 07:08:36', '2025-03-11 07:08:36'),
       (14, 'permission:read', 'read', '', '2025-03-11 07:08:48', '2025-03-11 07:08:48'),
       (15, 'permission:create', 'create', '', '2025-03-11 07:08:58', '2025-03-11 07:08:58'),
       (16, 'permission:update', 'update', '', '2025-03-11 07:09:07', '2025-03-11 07:09:07'),
       (17, 'role:delete', 'delete', '', '2025-03-11 07:08:36', '2025-03-11 07:08:36'),
       (18, 'role:read', 'read', '', '2025-03-11 07:08:48', '2025-03-11 07:08:48'),
       (19, 'role:create', 'create', '', '2025-03-11 07:08:58', '2025-03-11 07:08:58'),
       (20, 'role:update', 'update', '', '2025-03-11 07:09:07', '2025-03-11 07:09:07'),
       (21, 'log:read', 'read', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (22, 'log:update', 'update', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (23, 'log:create', 'create', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (24, 'log:delete', 'delete', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (25, 'user:manage', 'manage', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (26, 'menu:manage', 'manage', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (27, 'policy:manage', 'manage', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (28, 'permission:manage', 'manage', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (29, 'role:manage', 'manage', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37'),
       (30, 'log:manage', 'manage', '', '2025-03-12 05:30:37', '2025-03-12 05:30:37');

INSERT INTO "policies" ("id", "type", "effect", "action", "subject", "encode", "fields", "conditions", "args",
                        "description", "fields_data", "created_at", "updated_at")
VALUES (1, 2, 'can', 'manage', 'Permission',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (2, 1, 'can', 'manage', 'Permission',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (3, 0, 'can', 'manage', 'Permission',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (4, 2, 'can', 'manage', 'User',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (5, 1, 'can', 'manage', 'User',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (6, 0, 'can', 'manage', 'User',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (7, 2, 'can', 'manage', 'Role',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (8, 1, 'can', 'manage', 'Role',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (9, 0, 'can', 'manage', 'Role',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (10, 2, 'can', 'manage', 'Menu',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (11, 1, 'can', 'manage', 'Menu',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (12, 0, 'can', 'manage', 'Menu',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (13, 2, 'can', 'manage', 'Policy',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (14, 1, 'can', 'manage', 'Policy',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (15, 0, 'can', 'manage', 'Policy',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (16, 0, 'can', 'create', 'User',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (17, 0, 'can', 'update', 'User',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (18, 0, 'can', 'read', 'User',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlVzZXIiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (19, 0, 'can', 'delete', 'User',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (20, 1, 'can', 'create', 'User',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (21, 1, 'can', 'update', 'User',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (22, 1, 'can', 'delete', 'User',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (23, 1, 'can', 'read', 'User',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlVzZXIiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (24, 2, 'can', 'create', 'User',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (25, 2, 'can', 'update', 'User',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (26, 2, 'can', 'delete', 'User',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiVXNlciIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (27, 2, 'can', 'read', 'User',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlVzZXIiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (28, 0, 'can', 'create', 'Menu',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (29, 0, 'can', 'update', 'Menu',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (30, 0, 'can', 'read', 'Menu',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6Ik1lbnUiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (31, 0, 'can', 'delete', 'Menu',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (32, 1, 'can', 'create', 'Menu',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (33, 1, 'can', 'update', 'Menu',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (34, 1, 'can', 'delete', 'Menu',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (35, 1, 'can', 'read', 'Menu',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6Ik1lbnUiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (36, 2, 'can', 'create', 'Menu',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (37, 2, 'can', 'update', 'Menu',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (38, 2, 'can', 'delete', 'Menu',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiTWVudSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (39, 2, 'can', 'read', 'Menu',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6Ik1lbnUiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (40, 0, 'can', 'create', 'Policy',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (41, 0, 'can', 'update', 'Policy',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (42, 0, 'can', 'read', 'Policy',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlBvbGljeSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (43, 0, 'can', 'delete', 'Policy',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (44, 1, 'can', 'create', 'Policy',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (45, 1, 'can', 'update', 'Policy',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (46, 1, 'can', 'delete', 'Policy',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (47, 1, 'can', 'read', 'Policy',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlBvbGljeSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (48, 2, 'can', 'create', 'Policy',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (49, 2, 'can', 'update', 'Policy',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (50, 2, 'can', 'delete', 'Policy',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUG9saWN5IiwiZWZmZWN0IjoiY2FuIn0=', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (51, 2, 'can', 'read', 'Policy',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlBvbGljeSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (52, 0, 'can', 'create', 'Role',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (53, 0, 'can', 'update', 'Role',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (54, 0, 'can', 'read', 'Role',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlJvbGUiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (55, 0, 'can', 'delete', 'Role',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (56, 1, 'can', 'create', 'Role',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (57, 1, 'can', 'update', 'Role',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (58, 1, 'can', 'delete', 'Role',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (59, 1, 'can', 'read', 'Role',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlJvbGUiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (60, 2, 'can', 'create', 'Role',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (61, 2, 'can', 'update', 'Role',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (62, 2, 'can', 'delete', 'Role',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUm9sZSIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (63, 2, 'can', 'read', 'Role',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlJvbGUiLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL, NULL,
        NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (64, 0, 'can', 'create', 'Permission',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (65, 0, 'can', 'update', 'Permission',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (66, 0, 'can', 'read', 'Permission',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlBlcm1pc3Npb24iLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (67, 0, 'can', 'delete', 'Permission',
        'eyJ0eXBlIjowLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (68, 1, 'can', 'create', 'Permission',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (69, 1, 'can', 'update', 'Permission',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (70, 1, 'can', 'delete', 'Permission',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (71, 1, 'can', 'read', 'Permission',
        'eyJ0eXBlIjoxLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlBlcm1pc3Npb24iLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (72, 2, 'can', 'create', 'Permission',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (73, 2, 'can', 'update', 'Permission',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJ1cGRhdGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (74, 2, 'can', 'delete', 'Permission',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJkZWxldGUiLCJzdWJqZWN0IjoiUGVybWlzc2lvbiIsImVmZmVjdCI6ImNhbiJ9', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30'),
       (75, 2, 'can', 'read', 'Permission',
        'eyJ0eXBlIjoyLCJhY3Rpb24iOiJyZWFkIiwic3ViamVjdCI6IlBlcm1pc3Npb24iLCJlZmZlY3QiOiJjYW4ifQ==', NULL, NULL, NULL,
        NULL, NULL, '2025-03-15 14:06:30', '2025-03-15 14:06:30');

INSERT INTO "roles" ("id", "name", "code", "description", "created_at", "updated_at")
VALUES (1, 'admin', 'admin', '超级管理员，拥有所有的权限', '2025-03-11 09:10:30', '2025-03-11 09:10:30'),
       (2, '平台用户', 'user', '普通用户，拥有基本的权限', '2025-03-11 09:10:30', '2025-03-11 09:10:30'),
       (3, '游客', 'guest', '部分查看功能', '2025-03-11 09:10:30', '2025-03-11 09:10:30');

INSERT INTO "users" ("id", "username", "password", "email", "phone", "name", "avatar", "openid", "session_key", "city",
                     "province", "country", "unionid", "age", "status", "type", "gender", "expired", "created_at",
                     "updated_at")
VALUES (1, 'adminer',
        '$argon2id$v=19$m=65536,t=3,p=4$mGV6MnlrLs+8EQEXKts1yg$6aySZH+tRvtibtQRupGllx6jFGj9efrOod4OMHyxXvY', NULL, NULL,
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-03-03 09:49:08',
        '2025-03-03 09:49:08'),
       (2, 'guest', '$argon2id$v=19$m=65536,t=3,p=4$lPWb8kCjOvs3GK9c48NVow$qvOB1UK7JO4GMfgc3kahrrWl4H5mwWBxyzAXPCzfki0',
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-03-17 05:34:02',
        '2025-03-17 05:34:02');

INSERT INTO "user_roles" ("id", "created_at", "updated_at", "user_id", "role_id")
VALUES (3, '2025-03-17 02:19:55.000000', '2025-03-17 02:19:55.000000', 1, 1),
       (4, '2025-03-17 05:37:38.000000', '2025-03-17 05:37:38.000000', 2, 3);

INSERT INTO "role_permissions" ("id", "created_at", "updated_at", "permission_id", "role_id")
VALUES (1, '2025-03-11 07:10:05', '2025-03-11 07:10:05', 1, 1),
       (2, '2025-03-11 07:10:05', '2025-03-11 07:10:05', 2, 1),
       (3, '2025-03-11 07:10:05', '2025-03-11 07:10:05', 3, 1),
       (4, '2025-03-11 07:10:05', '2025-03-11 07:10:05', 4, 1),
       (5, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 5, 1),
       (6, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 6, 1),
       (7, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 7, 1),
       (8, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 8, 1),
       (9, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 9, 1),
       (10, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 10, 1),
       (11, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 11, 1),
       (12, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 12, 1),
       (13, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 13, 1),
       (14, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 14, 1),
       (15, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 15, 1),
       (16, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 16, 1),
       (17, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 17, 1),
       (18, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 18, 1),
       (19, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 19, 1),
       (20, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 20, 1),
       (21, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 21, 1),
       (22, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 22, 1),
       (23, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 23, 1),
       (24, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 24, 1),
       (25, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 25, 1),
       (26, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 26, 1),
       (27, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 27, 1),
       (28, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 28, 1),
       (29, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 29, 1),
       (30, '2025-03-11 07:10:00', '2025-03-11 07:10:00', 30, 1),
       (31, '2025-03-17 05:38:31', '2025-03-17 05:38:31', 2, 2),
       (32, '2025-03-17 05:38:43', '2025-03-17 05:38:43', 6, 2),
       (33, '2025-03-17 05:38:54', '2025-03-17 05:38:54', 10, 2),
       (34, '2025-03-17 05:39:14', '2025-03-17 05:39:14', 14, 2),
       (35, '2025-03-17 05:39:25', '2025-03-17 05:39:25', 18, 2),
       (36, '2025-03-17 05:39:42', '2025-03-17 05:39:42', 21, 2),
       (37, '2025-03-17 05:38:31', '2025-03-17 05:38:31', 2, 3),
       (38, '2025-03-17 05:38:43', '2025-03-17 05:38:43', 6, 3),
       (39, '2025-03-17 05:38:54', '2025-03-17 05:38:54', 10, 3),
       (40, '2025-03-17 05:39:14', '2025-03-17 05:39:14', 14, 3),
       (41, '2025-03-17 05:39:25', '2025-03-17 05:39:25', 18, 3),
       (42, '2025-03-17 05:39:42', '2025-03-17 05:39:42', 21, 3);

INSERT INTO "role_policies" ("id", "created_at", "updated_at", "policy_id", "role_id")
VALUES (1, '2025-03-11 07:09:54', '2025-03-11 07:09:54', 1, 1),
       (2, '2025-03-11 07:10:05', '2025-03-11 07:10:05', 2, 1),
       (3, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 3, 1),
       (4, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 4, 1),
       (5, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 5, 1),
       (6, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 6, 1),
       (7, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 7, 1),
       (8, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 8, 1),
       (9, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 9, 1),
       (10, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 10, 1),
       (11, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 11, 1),
       (12, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 12, 1),
       (13, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 13, 1),
       (14, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 14, 1),
       (15, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 15, 1),
       (16, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 16, 1),
       (17, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 17, 1),
       (18, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 18, 1),
       (19, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 19, 1),
       (20, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 20, 1),
       (21, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 21, 1),
       (22, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 22, 1),
       (23, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 23, 1),
       (24, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 24, 1),
       (25, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 25, 1),
       (26, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 26, 1),
       (27, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 27, 1),
       (28, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 28, 1),
       (29, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 29, 1),
       (30, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 30, 1),
       (31, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 31, 1),
       (32, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 32, 1),
       (33, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 33, 1),
       (34, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 34, 1),
       (35, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 35, 1),
       (36, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 36, 1),
       (37, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 37, 1),
       (38, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 38, 1),
       (39, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 39, 1),
       (40, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 40, 1),
       (41, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 41, 1),
       (42, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 42, 1),
       (43, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 43, 1),
       (44, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 44, 1),
       (45, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 45, 1),
       (46, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 46, 1),
       (47, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 47, 1),
       (48, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 48, 1),
       (49, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 49, 1),
       (50, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 50, 1),
       (51, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 51, 1),
       (52, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 52, 1),
       (53, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 53, 1),
       (54, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 54, 1),
       (55, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 55, 1),
       (56, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 56, 1),
       (57, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 57, 1),
       (58, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 58, 1),
       (59, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 59, 1),
       (60, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 60, 1),
       (61, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 61, 1),
       (62, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 62, 1),
       (63, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 63, 1),
       (64, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 64, 1),
       (65, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 65, 1),
       (66, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 66, 1),
       (67, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 67, 1),
       (68, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 68, 1),
       (69, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 69, 1),
       (70, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 70, 1),
       (71, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 71, 1),
       (72, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 72, 1),
       (73, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 73, 1),
       (74, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 74, 1),
       (75, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 75, 1),
       (76, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 18, 2),
       (77, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 23, 2),
       (78, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 27, 2),
       (79, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 30, 2),
       (80, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 35, 2),
       (81, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 39, 2),
       (82, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 42, 2),
       (83, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 27, 2),
       (84, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 51, 2),
       (85, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 54, 2),
       (86, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 59, 2),
       (87, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 63, 2),
       (88, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 66, 2),
       (89, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 71, 2),
       (90, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 75, 2),
       (91, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 18, 3),
       (92, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 23, 3),
       (93, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 27, 3),
       (94, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 30, 3),
       (95, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 35, 3),
       (96, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 39, 3),
       (97, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 42, 3),
       (98, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 27, 3),
       (99, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 51, 3),
       (100, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 54, 3),
       (101, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 59, 3),
       (102, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 63, 3),
       (103, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 66, 3),
       (104, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 71, 3),
       (105, '2025-03-11 07:17:15', '2025-03-11 07:17:15', 75, 3);

-- ----------- End of file ---------------
ALTER TABLE ONLY "public"."menu_meta" ADD CONSTRAINT "menu_meta_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES menus(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."menus" ADD CONSTRAINT "menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES menus(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."policy_permissions" ADD CONSTRAINT "policy_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."policy_permissions" ADD CONSTRAINT "policy_permissions_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES policies(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."role_menus" ADD CONSTRAINT "role_menus_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES menus(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."role_menus" ADD CONSTRAINT "role_menus_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."role_policies" ADD CONSTRAINT "role_policies_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES policies(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."role_policies" ADD CONSTRAINT "role_policies_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
