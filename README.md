Revisioning Plugin for Serverless
==========================

Applies an `API-Revision` header to API Gateway responses that consists of the project/function package.json version and the latest short commit hash from HEAD.

###Installation

Install the plugin in the root of your project:
```
npm install serverless-plugin-revision
```

Open the 's-project.json' in your Project's root folder and add the plugin to the `plugins` property, like this:
```
"plugins": [
	"serverless-plugin-revision"
]
```


