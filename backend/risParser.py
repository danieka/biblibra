""" Process RIS format following the standard at",
http://referencemanager.com/sites/rm/files/m/direct_export_ris.pdf """
import re


class RIS:
    """ RIS file structure """

    def __init__(self, in_file=None):
        """ Initialize and parse input """
        self.records = []
        if in_file:
            self.parse(in_file)

    def parse(self, in_file):
        """ Parse input file """
        self.current_tag = None
        self.current_record = None
        prog = re.compile("^([A-Z][A-Z0-9]) *- *(.*)")
        lines = []
        # Eliminate blank lines
        for line in in_file.split("\n"):
            line = line.strip()
            if len(line) > 0:
                lines.append(line)
        for line in lines:
            match = prog.match(line)
            if match:
                tag = match.groups()[0]
                field = match.groups()[1]
                self.process_field(tag, field)
            else:
                raise ValueError(line)

    def process_field(self, tag, field):
        """ Process RIS file field """
        if tag == "TY":
            self.current_record = {tag: field}
        elif tag == "ER":
            self.records.append(self.current_record)
            self.current_record = None
        elif tag in ["AU", "AD", "KW", "N1"]:
            if tag in self.current_record:
                self.current_record[tag].append(field)
            else:
                self.current_record[tag] = [field]
        else:
            if not tag in self.current_record:
                self.current_record[tag] = field
