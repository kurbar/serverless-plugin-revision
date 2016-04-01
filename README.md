Revisioning Plugin for Serverless
==========================

Applies an `API-Revision` header to API Gateway responses that consists of the project/function package.json version and the latest short commit hash from HEAD.

###Get Started

Currently the plugin is not available on NPM yet as it might not be fully stable yet or have some other quirks.

Though you can still use it with your project.

* Create a `plugins` folder in the root folder of your project
* Clone the repo to the plugins folder: `git clone --depth=1 https://github.com/DHNCarlos/serverless-plugin-revision.git`
* Go into the newly cloned directory and run: `npm link`
* Then go to your projects root folder and run: `npm link serverless-plugin-revision`
* Finally open the 's-project.json' in your Project's root folder and add the plugin to the `plugins` property, like this:

```
"plugins": [
	"serverless-plugin-revision"
]
```


