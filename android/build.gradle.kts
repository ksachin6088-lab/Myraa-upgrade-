// Root build.gradle.kts for MYRAA Android App
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.3.1")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.22")
    }
}

task<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
