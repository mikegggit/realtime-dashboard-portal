Docker4Mac
==========
This document describes setting up the docker4mac environment.


Daemon setup
============

General tasks
* Setup proxy
* Advanced daemon configuration
* Enable Kubernetes

### Setup Proxy
If using a manual proxy, update the configuration in the Proxies tab.

* Switch to manual proxy
* Update configuration
Provide http / https proxy addresses.

For example, if using cntlm locally, http://localhost:3128 for both.

Add exclusions to prevent routing internal requests through the proxy.

```
registry.git.mine.com,localhost,127.0.0.1,git.mine.com, ...
```

### Advanced daemon configuration
Under the Daemon tab, click Advanced and include the following:

```
{
  "fixed-cidr" : "172.80.0.0/16",
  "insecure-registries" : [
    "registry.git.mine.com:443"
  ],
  "debug" : true,
  "experimental" : true,
  "bip" : "172.80.0.1/16"
}
```

### Enable Kubernetes
In the Kubernetes tab, check the Enable Kubernetes checkbox.

This will result in kubernetes being downloaded and Docker 4 Mac being restarted.

Issues encountered related to starting K8s may be related to proxy configuration.

