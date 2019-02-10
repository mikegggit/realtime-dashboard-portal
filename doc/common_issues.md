# Can't connect to repo:
Connect to repo1.maven.org:80 [repo1.maven.org/151.101.20.209] failed: Connection refused
Could not HEAD 'http://repo1.maven.org/maven2/log4j/log4j/1.2.17/log4j-1.2.17.pom

gradle build -Dhttp.proxyHost=localhost -Dhttp.proxyPort=3128 -Dhttp.proxyUser=grudkowm -Dhttp.proxyPassword=bar --debug --stacktrace -Dhttps.proxyHost=localhost -Dhttps.proxyPort=3128 -Dhttps.proxyUser=grudkowm -Dhttps.proxyPassword=bar -Dhttp.nonProxyHosts=dunno.com

---

> Can't seem to get dependency even though it's present in the gradle cache:
Clear gradle cache and rebuild.
/Users/grudkowm/.gradle/caches/modules-2/files-2.1/com.foo/bar

---

> Eclipse workspace isn't seeing dependencies declared in gradle build.

Synchronize Gradle projects with workspace failed due to an error connecting to the Gradle build.
Could not install Gradle distribution from 'https://services.gradle.org/distributions/gradle-2.13-bin.zip'.
Make sure the eclipse or eclipse-wtp plugins are installed.
Run gradle eclipse task.

-----

