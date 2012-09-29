# Avatar Service

## Service API

### `/add/<id> (POST)` **Add of update an entry** ###
#### Description ####
Add entry to the cache service. If entry already exists, updates entry (this will reset the ttl).

#### Parameters ####

| Parameter | Type    | Required | Description
|:----------|:-------:|:--------:|:-----------
| twitter   | string  | no       | Twitter account to use for avatar image. Not required if *url_http* is specified.
| url_http  | string  | no       | Image URL to use for item. Not required id *twitter* is specified.
| ttl       | integer | no       | time-to-live for entry in minutes. Default to 10080 (7 days).

#### Return value ####

| HTTP Code | Description
|:---------:|------------
| 200       | Entry was added successfully
| 400       | Missing parameter
| 500       | Server error


### `/<id> (GET)` **Returns image for entry** ###
#### Description ####
Returns image for specified item. If successful, this will cause an HTTP redirect (see return value below)

#### Parameters ####

| Parameter | Type    | Required | Description
|:----------|:-------:|:--------:|:-----------
| size      | string  | no       | Available sizes: *'n'* (normal), *'s'* (small), *'b'* (big) or *'o'* (original). If not size is specified, 'normal' is returned. In practice, different sizes are only available if a Twitter account was used, otherwise the *'url_http'* value (see /add/<id>) will be returned for all sizes.
| debug     | bool    | no       | Instead of causing an HTTP redirect, actually displays the cached entry.


#### Return value ####

| HTTP Code | Description
|:---------:|------------
| 302       | Redirect to item avatar's image URL
| 404       | Item not found
| 500       | Server error


## Installation and start

After downloading the latest version of the Avatar Service, you can install the node.js dependencies (one time only) and run the service with:

    npm install  
    node avatar_service


## Configuration


## Leveraging Apache/Nginx ##

Putting the Avatar Service behind Apache or Nginx allows 2 things:

1. Have Apache/Nginx cache the actual image
2. Support HTTPS


## Redis Data model

	<identifier> :
		{
			ttl: <ttl-in-minutes>,
			expires_on: <expire-date>,
			expires_on_time: <expire-time>,
			original_avatar_url_http: <url>,
			small_avatar_url_http: <url>,
			normal_avatar_url_http: <url>,
			big_avatar_url_http: <url>,
			twitter_handle: <twitter-handle>
		}
		