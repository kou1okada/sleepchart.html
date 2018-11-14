#!/bin/sh
exec ruby -x "$0" "$@"
#!ruby
# coding: utf-8

# lifelog2sleep.rb
# Copyright (c) 2018 Koichi OKADA. All rights reserved.
#
# This script converts lifelog log to sleep log.
# Lifelog log is formatted as below:
# ~~~
# YYYYmmdd
# HHMM	[sw](comment...)?
# HHMM	[sw](comment...)?
# ...
# ~~~
#
# Sleep log is formatted as below:
# ~~~
# YYYYmmdd HHMM [sw]
# ...
# ~~~

require 'nkf'
require 'date'

ARGV.each{|fn|
  logdatetime = logdate = logtime = stat = ""
  data = NKF::nkf('-w', File.read(fn))
  lines = data.split(/\r\n|\r|\n/)
  lines.each{|line|
    if    (line =~ /^END$/)
#      break
    elsif (line =~ /^(([0-9]{4})([0-9]{2})([0-9]{2}))[ \t]*$/)
      STDERR.puts "Warning: Incontinuous date sequence: #{logdate}, #{$1}" if logdate !="" && Date.parse($1) - Date.parse(logdate) != 1
      logdate = $1
    elsif (line =~ /^(([0-9]{2})([0-9]{2}))([ \t]*(([swoLh])([?,、 \t](.*))?))?[ ]*$/)
      logtime = $1
      last_logdatetime = logdatetime
      logdatetime = "#{logdate} #{logtime}"
      STDERR.puts "Warning: Incorrect time sequence: #{last_logdatetime}, #{logdatetime}" if last_logdatetime != "" && logdatetime < last_logdatetime
      stat = $6
      if stat =~ /[sw]/
        puts "%s %s %s" % [logdate, logtime, stat]
      end
    end
  }
}
