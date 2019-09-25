#!/usr/bin/python3

import base64
import os.path

def check_dir(folder):
  if not os.path.exists(folder):
    os.mkdir(folder)

def save_file(folder, time, name, data):
  check_dir(folder)
  with open(folder+'/'+time+'_'+name, 'wb') as f:
    f.write(base64.decodebytes(bytes(data, encoding='utf-8')))