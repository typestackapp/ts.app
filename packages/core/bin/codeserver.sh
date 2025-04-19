#!/bin/sh -e

# Only create docker group if it doesn't already exist AND if there's no group with the target GID
DOCKER_GID=$(stat -c %g /var/run/docker.sock 2>/dev/null || echo 0)

if ! getent group docker >/dev/null; then
    groupadd -g "$DOCKER_GID" docker || echo "Docker group already exists with different GID"
fi

# Add abc user to the docker group
usermod -aG docker abc || true

# Do NOT change ownership of the socket! Let the host manage it.

# run bash script: /init
exec /init