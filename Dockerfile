FROM gradle:jdk21-jammy as builder
WORKDIR /opt/blog
COPY --chown=gradle:gradle . .
RUN gradle build --no-daemon -x test --info

FROM sapmachine:21-jdk-ubuntu-jammy
WORKDIR /opt/blog
COPY --from=builder /opt/blog/server/build/libs/*.jar ./blog.jar
CMD java -jar blog.jar
