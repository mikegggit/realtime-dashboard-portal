Opening Monitor
===============
This is a personal project which ended up growing into an operations tool used at Nasdaq.


Goals
-----
The main overarching goal of this project was to demonstrate how a containerized custom dashboard could be deployed to a kubernetes cluster and be used by operations personnel to monitor production systems.

Functional goals
----------------
* Accurately reflect the state of upstream system in near-realtime fashion
* UI must be reactive 

Technical Goals
---------------
* Evaluate Flux and Immutable.js 
* Evaluate frontend build tools 
* Utilize ES6 javascript constructs
* Develop custom D3 components
* Evaluate docker compose as a dev orchestration tool
* Deploy containerized app to production kubernetes cluster



Architecture
------------
* Middle tier 

  Compressed data tier and Service API

* Web server
* UI

# Middle tier
The middle tier contains an embedded stream producer.  The stream producer feeds a data pipeline.  The data pipeline publishes to the embedded data service.

A service layer is embedded to service the UI by serving data from the embedded data service.

# Web server
The web server differs in dev vs production-like mode.

In dev mode, the system leverages a built-in express server.

In prod mode, an nginx server is configured to serve the ui bundle and reverse proxy calls to the middle-tier service API.

# UI
The UI is built using the following:
* React
* Flux
* React Toolbox component library
* D3 custom components
* Immutable.js

## Flux
A key aspect of the UI architecture is use of the Flux pattern of data flows.

https://github.com/facebook/flux/blob/master/examples/flux-concepts/flux-simple-f8-diagram-with-client-action-1300w.png

As described elsewhere, Actions are the driving force behind UI architectures using flux and represent the API of the UI.  Actions typically originate from a view, either driven by user interaction or some timed event.  They may also originate on receipt of data from a subscription.  Actions are dispatched to one or more stores via a singleton dispatcher, and acted upon by these stores such as to modify the state from which the views are projected.  A store may handle an Action, possibly update it's state, and emit a change event.  Views that register to a store may then choose to re-render components if desired. 

### Lessons learned
Flux has very little boiler plate to deal with and has a relatively flat learning curve.  

### Next steps
Evaluate Redux.

See https://facebook.github.io/flux/docs/overview.html.


Ingestion
---------
In a real solution, data would be published by an upstream socket-server.  Here, the data stream is simulated by a Java stream implementation.  

At the time of this writing, no parsing of binary data is required. The stream publishes data already decoded into native messaging fields.  The stream pipeline maps these messages into domain stats messages and stores into the embedded data cache component.

There is an arbitrary Thread.sleep embedded in the pipeline as a dumb way to avoid a tight loop / cpu spin.


## Lessons learned
The stream generator is very cpu intensive absent some kind of throttle.

Assuming there is not need to provide updates to a UI more frequently than once every second or two, an upstream provider may be useful to only provide snapshots to an API server at the same frequence as updates are desired to the UI.  

Without throttling, it is left to the UI or server push mechanism to avoid overwhelming the UI with updates.

Especially when using web-sockets, it is important that the dashboard provider implement some type of throttling mechanism to avoid overwhelming the UI.


Note regarding Data API / Service API
--------------------------------------
The backend architecture is not intended to be scalable.

A scalable architecture would separate the following:
* Ingestion of upstream data
* Publishing of transformed ingested data to data tier
* Data API
* Service API


Build
-----

Select tasks - mon-mt
---------------------


# Build executable jar and create rpm
gradle mon-mt:bootRepackage mon-mt:createRpm

# Run middle-tier app
To run previously packaged jar:
java -jar mon-mt/build/libs/mon-ng-app-[version].jar

To run unpackaged app:
gradle mon-mt:bootRun



Select tasks - mon-ui
---------------------
# build ui for dev environment
npm --prefix ./mon-ui run build:dev 

<or>

gradle mon-ui:clean mon-ui:webpack_dev mon-ui:createRpm

# run ui 
npm --prefix ./mon-ui run start

# Create rpm
gradle mon-ui:createRpm


Containerization
----------------
Container dependencies are managed using https://github.com/vishnubob/wait-for-it.git

# Steps to building the mon-mt container

docker pull nimmis/java-centos:oracle-8-jre

docker tag nimmis/java-centos:oracle-8-jre localhost:5000/nimmis/java-centos:oracle-8-jre

# copy rpm from mon-mt/build/distributions/ into mon-mt/docker
e.g. cp mon-mt/build/distributions/mon-ng-app-0.0.1-1.x86_64.rpm mon-mt/docker


docker build  --build-arg MON_VERSION=0.0.1-1 --target release --rm -t localhost:5000/options/mon-ng/mon-mt:latest -f mon-mt/Dockerfile mon-mt/docker


docker-compose up

curl localhost:8080/stats/estats
curl localhost:8080/stats/ustats?exchange=A




# Steps to building the mon-ui container

docker pull centos:7

# copy rpm from mon-ui/build/distributions/ into mon-ui/docker
e.g. cp mon-ui/build/distributions/mon-ui-0.0.1-1.x86_64.rpm mon-ui/docker/

docker build  --build-arg MON_VERSION=0.0.1-1 --target release --rm -t localhost:5000/options/mon-ng/mon-ui:latest -f mon-ui/Dockerfile mon-ui/docker



