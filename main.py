#!/usr/bin/python3

import os.path
import time
import xmltodict
import json
import mms_files_decoder
from io import open
import config

timestamp = int(time.time())
result_folder = 'result'+str(timestamp)
result_filename = result_folder+'.json'

def msg_direction(msg_type):
  if msg_type == '1':
    return 'received'
  elif msg_type == '2':
    return 'sent'

def create_sms_dict(sms):
  msg = {
    'type' : 'sms',
    'dir' : msg_direction(sms['@type']),
    'text' : sms['@body'],
    'date' : sms['@readable_date']
  }
  return msg

def create_mms_dict(mms):
  parts = []
  for part in mms['parts']['part']:
    if part['@ct'] == 'application/smil':
      pass
    elif part['@ct'] == 'text/plain':
      parts.append({part['@ct'] : part['@text']})  
    else:
      parts.append({part['@ct'] : mms['@date']+'_'+part['@cl']})  
  msg = {
    'type' : 'mms',
    'dir' : msg_direction(mms['@msg_box']),
    'content' : parts,
    'date' : mms['@readable_date']
  }
  return msg
  
def decode_mms_content(mms):
  for part in mms['parts']['part']:
    if part['@ct'] == 'application/smil' or part['@ct'] == 'text/plain':
      pass
    else:
      pass
      mms_files_decoder.save_file(result_folder, mms['@date'], part['@cl'], part['@data'])

with open(config.input_file, 'r', encoding='utf-8') as source:
  data = xmltodict.parse(source.read())
  sms_no = 0
  sms_len = len(data['smses']['sms'])
  mms_no = 0
  mms_len = len(data['smses']['mms'])
  texts = {}
  while (sms_no < sms_len) or (mms_no < mms_len):
    if (sms_no == sms_len):
      texts.update({sms_no+mms_no : create_mms_dict(data['smses']['mms'][mms_no])})
      decode_mms_content(data['smses']['mms'][mms_no])
      mms_no += 1
    elif (mms_no == mms_len):
      texts.update({sms_no+mms_no : create_sms_dict(data['smses']['sms'][sms_no])})
      sms_no += 1
    elif data['smses']['sms'][sms_no]['@date'] < data['smses']['mms'][mms_no]['@date']:
      texts.update({sms_no+mms_no : create_sms_dict(data['smses']['sms'][sms_no])})
      sms_no += 1
    elif data['smses']['sms'][sms_no]['@date'] > data['smses']['mms'][mms_no]['@date']:
      texts.update({sms_no+mms_no : create_mms_dict(data['smses']['mms'][mms_no])})
      decode_mms_content(data['smses']['mms'][mms_no])
      mms_no += 1
  with open(result_filename, 'a', encoding='utf-8') as result:
    json.dump(texts, result)