[![Build Status](https://travis-ci.org/OADA/oada-formats.svg?branch=master)](https://travis-ci.org/OADA/oada-formats)
[![Coverage Status](https://coveralls.io/repos/OADA/oada-formats/badge.svg?branch=master)](https://coveralls.io/r/OADA/oada-formats?branch=master)
[![Dependency Status](https://david-dm.org/oada/oada-formats.svg)](https://david-dm.org/oada/oada-formats)
[![License](http://img.shields.io/:license-Apache%202.0-green.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

# oada-formats
The purpose of this repo is to act as an inventory of known ag data formats.
Since the OADA API uses content type strings to identify types, the formats here
are organized by media type: if you receive a file via the OADA API, you should
be able to use it's content-type to look up details on its format here.

*If you want to look at some of the formats, start clicking through 
[them here](./formats/application/vnd/oada)*

We believe it is simplest to learn about a format by seeing examples of that
format.  Therefore, all formats included here should have a least one example,
and most of the details about any given format exist as comments
directly in the examples.  You can also supply a schema to do validation, but 
the examples should still be the main source of knowledge about the format.

This repo contains models for all formats whose format is known from a given
media type. Each model consists of a module with `validate()`, `schema()`, and
`example()` functions. Some base model types, e.g., JsonModel, are available for
use.

`oada-formats` exposes a `Formats` class that acts as a repository of models.
The `model()` function is a factory function for various mediatype models. The
`use()` function can be used to extend the model types and model repository. See
[valleyix-formats][valleyix-formats] for an example. `oada-formats` comes with
OADA defined formats pre-loaded by default.

## Installation ##
```shell
npm install oada-formats
```

## Usage ##
```js
var Formats = require('oada-formats');

var formats = new Formats();
formats.use(require('your-favorite-model=package'));

formats
  .model('application/vnd.oada.bookmarks.1+json')
  .then(function(model) {
    return model.validate(model.example());
  })
  .then(/* success */)
  .catch(Format.ValidationError, function(error) {
    console.log(error.errors);
  });
```

```js
var Formats = require('oada-formats');

var formats = new Formats();

var model = formats.model('application/vnd.oada.link.1+json');

model.examples().then(console.log);
model.example('default').then(console.log);
model.schema().then(console.log);
```

# Adding JSON Models

The `JsonModel` can be used to add new json models easily.
[valleyix-formats][valleyix-formats] is a good example.

1. Build a directory structure where each folder in the hierarchy is the next
   word of the format's mediatype, split on '/' and '.'.
2. At the root of the directory structure there must be an index.js that exposes
   a plain old object. It may have any property names, however, `JsonModel` will
   load the values of properties `examples` and `schema` as the format's
   examples and schema respectively. An array of `function(data)` implementing
   custom validation rules can be stored under the `addtionalValidators`
   property. `index.js` may expose the plain old object, a promise of a plain
   old object, or a plain old object with promises at its first level of
   properties. Therefore any type of asynchronous loading can be done, e.g.,
   http or database.
3. If there is not an `examples` property then any `js` or `json` file in an
   `examples` directory at the root of the mediatype directory structure will be
   loaded in as the examples. The example name will be the filename less it's
   file extension.
4. If there is not a `schema` property then a `schema.js` or `schema.json` file
   at the root of the mediatype directory structure will be loaded in as the
   schema.

# OADA Formats

NOTE: all oada-defined formats (i.e. that start with "application/vnd.oada") endeavour to use duck 
typing for it's key names: if you see a particular key in any of the formats, that
key should mean the same thing every time it's used.

- [application/vnd.oada.bookmarks.1+json](#user-content-applicationvndoadabookmarks1json)
  * [Schema](#schema)
  * [Example](#example)
- [application/vnd.oada.clients.1+json](#user-content-applicationvndoadaclients1json)
  * [Schema](#schema)
  * [Example](#example)
- [application/vnd.oada.irrigation.1+json](#user-content-applicationvndoadairrigation1json)
  * [Schema](#schema)
  * [Example](#example)
- [application/vnd.oada.irrigation.machines.1+json](#user-content-applicationvndoadairrigationmachines1json)
  * [Schema](#schema)
  * [Example](#example)
- [application/vnd.oada.link.1+json](#user-content-applicationvndoadalink1json)
  * [Schema](#schema)
  * [Example](#example)
- [application/vnd.oada.oada-configuration.1+json](#user-content-applicationvndoadaoada-configuration1json)
  * [Schema](#schema)
  * [Example](#example)
- [application/vnd.oada.oauth-dyn-reg.register-response.1+json](#user-content-applicationvndoadaoauth-dyn-regregister-response1json)
  * [Schema](#schema)
  * [Example](#example)

# application/vnd.oada.bookmarks.1+json

## Schema
```json
{
  "id": "oada-formats://application/vnd.oada.bookmarks.1+json",
  "description": "application/vnd.oada.bookmarks.1+json",
  "additionalProperties": true,
  "properties": {
    "planting": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    },
    "harvest": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    },
    "machines": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    },
    "irrigation": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    },
    "sensors": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    },
    "fields": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    },
    "sales": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    },
    "clients": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    }
  }
}
```

## Example
```json
{
  "planting": {
    "_id": "09ijfofj",
    "_rev": "2-djfh92843hj"
  },
  "harvest": {
    "_id": "908uf2jh",
    "_rev": "33-kdfj092jle"
  },
  "machines": {
    "_id": "0kdfj20j",
    "_rev": "8-kdjs90fj2oi"
  },
  "irrigation": {
    "_id": "0jk2iopw",
    "_rev": "4-d98ohf29efk"
  },
  "sales": {
    "_id": "0kdfj20j",
    "_rev": "99-kdjf92lsdf"
  },
  "sensors": {
    "_id": "kd02ufjk",
    "_rev": "3-kdsfjoiwefj"
  },
  "fields": {
    "_id": "0kdfj2jl",
    "_rev": "7-kk0all2oald"
  },
  "clients": {
    "_id": "9sdkf2lk",
    "_rev": "4-lfdu029kjds"
  }
}
```

# application/vnd.oada.clients.1+json

## Schema
```json
{
  "id": "oada-formats://application/vnd.oada.clients.1+json",
  "description": "application/vnd.oada.clients.1+json",
  "additionalProperties": true,
  "required": [
    "name",
    "list"
  ],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "clients"
    },
    "list": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/list"
    }
  }
}
```

## Example
```json
{
  "name": "clients",
  "list": {
    "0jfl290ijfklwsdf": {
      "_id": "321cba",
      "_rev": "90-k2983wfhjdsdf"
    },
    "kl9ojksfh92hkwef": {
      "_id": "389dfj",
      "_rev": "2-kdfj29eflwdfsd"
    }
  }
}
```

# application/vnd.oada.irrigation.1+json

## Schema
```json
{
  "id": "oada-formats://application/vnd.oada.irrigation.1+json",
  "description": "application/vnd.oada.irrigation.1+json",
  "additionalProperties": true,
  "properties": {
    "machines": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/versioned"
    }
  }
}
```

## Example
```json
{
  "machines": {
    "_id": "dummyid123AFG",
    "_rev": "1-dummy02ijfl"
  }
}
```

# application/vnd.oada.irrigation.machines.1+json

## Schema
```json
{
  "id": "oada-formats://application/vnd.oada.irrigation.machines.1+json",
  "description": "application/vnd.oada.irrigation.machines.1+json",
  "required": [
    "name",
    "list"
  ],
  "additionalProperties": true,
  "properties": {
    "name": {
      "type": "string",
      "pattern": "irrigation"
    },
    "list": {
      "$ref": "oada-formats://application/vnd.oada.link.1+json#/definitions/list"
    }
  }
}
```

## Example
```json
{
  "name": "irrigation",
  "list": {
    "dummyrandomthing": {
      "_id": "dummyid123AFG",
      "_rev": "1-dummy02ijfl"
    },
    "klsdfj0982ifjoow": {
      "_id": "df002jfk2ojsl",
      "_rev": "3-jkfd0ijs8zk"
    }
  }
}
```

# application/vnd.oada.link.1+json

## Schema
```json
{
  "id": "oada-formats://application/vnd.oada.link.1+json",
  "description": "OADA Link object",
  "definitions": {
    "link": {
      "anyOf": [
        {
          "$ref": "#/definitions/nonversioned"
        },
        {
          "$ref": "#/definitions/versioned"
        }
      ]
    },
    "nonversioned": {
      "type": "object",
      "required": [
        "_id"
      ],
      "additionalProperties": true,
      "properties": {
        "_id": {
          "type": "string"
        }
      }
    },
    "versioned": {
      "type": "object",
      "required": [
        "_rev",
        "_id"
      ],
      "additionalProperties": true,
      "properties": {
        "_id": {
          "type": "string"
        },
        "_rev": {
          "type": "string",
          "pattern": "^[0-9]+-.+"
        }
      }
    },
    "list": {
      "versioned": {
        "type": "object",
        "additionalProperties": {
          "$ref": "#/definitions/versioned"
        }
      },
      "nonversioned": {
        "type": "object",
        "additionalProperties": {
          "$ref": "#/definitions/nonversioned"
        }
      },
      "list": {
        "type": "object",
        "additionalProperties": {
          "$ref": "#/definitions/link"
        }
      }
    }
  }
}
```

## Example
```json
{
  "_id": "akjf92jxcJds",
  "_rev": "1-jxusuf3sc"
}
```

# application/vnd.oada.oada-configuration.1+json

## Schema
```json
{
  "id": "oada-formats://application/vnd.oada.well-known.oada-configuration.1+json",
  "description": "application/vnd.oada.well-known.oada-configuration.1+json",
  "required": [
    "oada_base_uri",
    "authorization_endpoint",
    "token_endpoint",
    "registration_endpoint",
    "client_assertion_signing_alg_values_supported"
  ],
  "additionalProperties": true,
  "properties": {
    "oada_base_uri": {
      "type": "string",
      "pattern": "^https://.*"
    },
    "authorization_endpoint": {
      "type": "string",
      "pattern": "^https://.*"
    },
    "token_endpoint": {
      "type": "string",
      "pattern": "^https://.*"
    },
    "registration_endpoint": {
      "type": "string",
      "pattern": "^https://.*"
    },
    "client_assertion_signing_alg_values_supported": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string"
      }
    }
  }
}
```

## Example
```json
{
  "well_known_version": "1.0.0",
  "oada_base_uri": "https://oada.example.com",
  "authorization_endpoint": "https://oada.example.com/auth",
  "token_endpoint": "https://oada.example.com/token",
  "registration_endpoint": "https://oada.example.com/register",
  "client_assertion_signing_alg_values_supported": [
    "RS256"
  ],
  "scopes_supported": [
    {
      "name": "oada.all.1",
      "read+write": true
    }
  ]
}
```

# application/vnd.oada.oauth-dyn-reg.register-response.1+json

## Schema
```json
{
  "id": "oada-formats://application/vnd.oada.oauth-dyn-reg.register-response.1+json",
  "description": "application/vnd.oada.oauth-dny-reg.register-response.1+json",
  "required": [
    "client_id",
    "client_id_issued_at",
    "scopes",
    "redirect_uris",
    "token_endpoint_auth_method",
    "grant_types",
    "response_types",
    "tos_uri",
    "policy_uri",
    "software_id"
  ],
  "additionalProperties": true,
  "properties": {
    "client_id": {
      "type": "string"
    },
    "client_id_issued_at": {
      "type": "number"
    },
    "scopes": {
      "type": "string"
    },
    "redirect_uris": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string",
        "pattern": "^https://.*"
      }
    },
    "token_endpoint_auth_method": {
      "type": "string"
    },
    "grant_types": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string"
      }
    },
    "response_types": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string"
      }
    },
    "tos_uri": {
      "type": "string",
      "format": "uri"
    },
    "policy_uri": {
      "type": "string",
      "format": "uri"
    },
    "software_id": {
      "type": "string"
    }
  }
}
```

## Example
```json
{
  "client_id": "3klaxu838akahf38acucaix73",
  "client_id_issued_at": 1418423102,
  "software_version": "1.0-ga",
  "scopes": "read:planting.prescriptions write:fields",
  "redirect_uris": [
    "https://client.example.com/callback",
    "https://client.example.com/cb"
  ],
  "token_endpoint_auth_method": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  "grant_types": [
    "implicit",
    "authorization_code",
    "refresh_token"
  ],
  "response_types": [
    "token",
    "code"
  ],
  "client_name": "Example OADA Client",
  "client_uri": "http://example.com",
  "logo_uri": "http://example.com/logo.png",
  "contacts": [
    "Clint Client <cclient@example.com>"
  ],
  "tos_uri": "http://example.com/tos.html",
  "policy_uri": "http://example.com/policy.html",
  "software_id": "djxkjau3n937xz7jakl3",
  "registration_provider": "registration.example.com"
}
```

[valleyix-formats]: http://github.com/oada/valleyix-formats
