#!/bin/sh
exec ruby -x "$0" "$@"
#!ruby
# coding: utf-8

# ura2sleep.rb
# Copyright (c) 2018 Koichi OKADA. All rights reserved.
#
# This script converts ura log to sleep log.
# Ura log has 'YYYYmmdd.txt' style filename and be formatted as below:
# ~~~
# #time HHMM
# comment ...
# ...
# #time HHMM
# 帰宅開始
# ~~~
#
# Sleep log is formatted as below:
# ~~~
# YYYYmmdd HHMM [sw]
# ...
# ~~~

require 'nkf'
require 'date'

def logputs(logdate, logtime, stat)
  if 2400 <= logtime.to_i
    logdate = (Date.parse(logdate) + (logtime.to_i / 2400)).strftime("%Y%m%d")
    logtime = "%04d" % [logtime.to_i % 2400]
  end
 puts "%s %s %s" % [logdate, logtime, stat]
end

ARGV.each{|fn|
  logdatetime = logtime = stat = ""
  logdate = fn =~ /([0-9]{8})/ ? $1 : ""
  data = NKF::nkf('-w', File.read(fn))
  lines = data.split(/\r\n|\r|\n/)
  lines.each{|line|
    if (line =~ /^#time[ \t]*([0-9]{4})/)
      logtime = $1
      last_logdatetime = logdatetime
      logdatetime = "#{logdate} #{logtime}"
      STDERR.puts "Warning: Incorrect time sequence: #{last_logdatetime}, #{logdatetime}" if last_logdatetime != "" && logdatetime < last_logdatetime
      if stat == "s"
        logputs logdate, logtime, "w"
        stat = ""
      end
    end
    if (line =~ /^沈没/)
      logputs logdate, logtime, "s"
      stat = "s";
    end
  }
}

