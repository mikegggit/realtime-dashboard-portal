> Can't connect to repo:
Connect to repo1.maven.org:80 [repo1.maven.org/151.101.20.209] failed: Connection refused
Could not HEAD 'http://repo1.maven.org/maven2/log4j/log4j/1.2.17/log4j-1.2.17.pom

You can also put this in gradle.properties

gradle build -Dhttp.proxyHost=foo.bar.com -Dhttp.proxyPort=8080 -Dhttp.proxyUser=grudkowm -Dhttp.proxyPassword=F@ll2017??? --debug --stacktrace -Dhttps.proxyHost=foo.bar.com -Dhttps.proxyPort=8080 -Dhttps.proxyUser=grudkowm -Dhttps.proxyPassword=F@ll2017??? -Dhttp.nonProxyHosts=nexus.repo.foo.bar.com

-----
> Can't seem to get dependency even though it's present in the gradle cache:
Clear gradle cache and rebuild.
/Users/grudkowm/.gradle/caches/modules-2/files-2.1/com.bar/mylib
-----
> Eclipse workspace isn't seeing dependencies declared in gradle build.

Synchronize Gradle projects with workspace failed due to an error connecting to the Gradle build.
Could not install Gradle distribution from 'https://services.gradle.org/distributions/gradle-2.13-bin.zip'.
Make sure the eclipse or eclipse-wtp plugins are installed.
Run gradle eclipse task.

-----

-----

-----

