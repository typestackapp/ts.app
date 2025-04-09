#!/bin/sh -e
if ! getent group docker; then
    groupadd -g 999 docker
fi

if ! id abc &>/dev/null; then
    usermod -aG docker abc
fi

# if exists chmod docker socket
if [ -S /usr/bin/docker ]; then
    chown root:docker /usr/bin/docker
fi

# if exists chmod docker socket
if [ -S /var/run/docker.sock ]; then
    chown root:docker /var/run/docker.sock
fi

# This is the first program launched at container start.
# We don't know where our binaries are and we cannot guarantee
# that the default PATH can access them.
# So this script needs to be entirely self-contained until it has
# at least /command, /usr/bin and /bin in its PATH.

addpath () {
  x="$1"
  IFS=:
  set -- $PATH
  IFS=
  while test "$#" -gt 0 ; do
    if test "$1" = "$x" ; then
      return
    fi
    shift
  done
  PATH="${x}:$PATH"
}

if test -z "$PATH" ; then
  PATH=/bin
fi

addpath /bin
addpath /usr/bin
addpath /command
export PATH

# Now we're good: s6-overlay-suexec is accessible via PATH, as are
# all our binaries.
# Run preinit as root, then run stage0 as the container's user (can be
# root, can be a normal user).

exec s6-overlay-suexec \
  ' /package/admin/s6-overlay-3.1.5.0/libexec/preinit' \
  '' \
  /package/admin/s6-overlay-3.1.5.0/libexec/stage0 \
  "$@"