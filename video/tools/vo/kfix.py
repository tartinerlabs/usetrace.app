# espeak-ng from espeakng_loader ignores long data paths (buffer limit) and wants
# the PARENT of its espeak-ng-data dir. Point ESPEAK_DATA_PARENT at a short path
# that holds (a symlink to) espeak-ng-data, e.g.:
#   mkdir -p /tmp/espkp && ln -s "$(python -c 'import espeakng_loader as e; print(e.get_data_path())')" /tmp/espkp/espeak-ng-data
import os
from misaki import espeak  # noqa
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_data_path(os.environ.get("ESPEAK_DATA_PARENT", "/tmp/espkp"))
